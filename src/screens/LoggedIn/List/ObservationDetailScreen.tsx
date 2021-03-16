import React, { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import {
  LitterType,
  Measurement,
  Observation,
  ObservationImage,
  User,
} from "../../../models";

import { Alert, FlatList, Image } from "react-native";

import { Screen } from "../../../components/Screen";
import { NavigationProps } from "../../../navigation/types";
import {
  FlexColumn,
  ListItem,
  Section,
  SectionHeader,
  Text,
} from "../../../components/elements";
import { theme } from "../../../theme";
import { Item } from "react-navigation-header-buttons";
import BasicHeaderButtons from "../../../components/BasicHeaderButtons";
import { deleteObservation, fetchObservationCreator } from "../../../store/slices/observations";
import { fetchMeasurements, selectMeasurement } from "../../../store/slices/measurements";

export default function ObservationDetailScreen({
  navigation,
}: NavigationProps) {
  const dispatch = useThunkDispatch();

  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

  const measurementEntries = useSelector<RootState, Array<Measurement>>(
    (state) => state.measurements.measurementEntries
  );

  const observationUsers = useSelector<RootState, Array<User>>(
    (state) => state.observations.observationUsers
  )

  const observationCreator = observationUsers.find(x => x.id === observationEntry?.creatorId);

  const filteredMeasurementEntriesBySelectedObservation = measurementEntries.filter(
    (m) => m.observationId === observationEntry?.id
  );

  const litterTypes = useSelector<RootState, Array<LitterType>>(
    (state) => state.measurements.litterTypes
  );

  const observationImages = useSelector<RootState, Array<ObservationImage>>(
    (state) => state.observations.observationImages
  );

  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );

  const getObserverName = (creatorId:string): string | undefined => {
    if(creatorId !==user?.id) {
      if(observationCreator)
        return `${observationCreator.givenNames} ${observationCreator?.familyName}`
      else
        return ""
    } 
    return `${user?.givenNames} ${user?.familyName}`
  }

  useEffect(() => {
    if(observationEntry && observationEntry.creatorId !==user?.id) { 
      dispatch(fetchObservationCreator({ creatorId: observationEntry.creatorId }));   
    }
    dispatch(fetchMeasurements({}));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicHeaderButtons>
          <Item
            title="Edit"
            onPress={() => navigation.navigate("observationEditScreen")}
          />
          <Item
            title="Delete"
            iconName="ios-trash"
            color={theme.color.palette.red}
            onPress={() => deleteAlert()}
          />
        </BasicHeaderButtons>
      ),
    });
  }, [navigation]);

  const deleteAlert = () =>
    Alert.alert(
      "Delete observation?",
      "This observation will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => dispatch(deleteObservation()),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );

  const getFeatureTypeById = (id: string) =>
    litterTypes.find((lt) => lt.id === id);

  
  const getObservationImage = (observation: Observation) => {
    const onlineImage: ObservationImage | undefined =
      isOnline && observation?.images && observation.images.length>0
        ? observation?.images[0]
        : undefined;
    const image: ObservationImage | undefined =
      onlineImage || observationImages.find((fi) => fi.observationId === observation?.id);
    return image?.url || "";
  };


  const navigateToDetailScreen = (measurementEntry: Measurement) => {
    dispatch(selectMeasurement(measurementEntry));
    navigation.navigate("featureDetailScreen");
  };

  const renderItem = ({ item }: { item: Measurement }) => (
    <ListItem onPress={() => navigateToDetailScreen(item)}>
      <Text>{getFeatureTypeById(item.litterTypeId)?.name}</Text>
    </ListItem>
  );

  const refreshingMeasurementsList = useSelector<RootState, boolean>(
    (state) => state.measurements.refreshing
  );

  return (
    <Screen>
      <FlatList
        refreshing={refreshingMeasurementsList}
        onRefresh={() => dispatch(fetchMeasurements({ forceRefresh: true }))}
        data={filteredMeasurementEntriesBySelectedObservation}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            {observationEntry && (
              <Section>
                <Text>
                  <Text bold>Observer:</Text> {getObserverName(observationEntry.creatorId)}
                </Text>
                { getObservationImage(observationEntry) !== "" && (
                  <>
                  <Text bold>Picture:</Text>
                  <Image source={{ uri: getObservationImage(observationEntry) }} style={{ width: "100%", height: 200}} />
                  </>
                )}
                <Text>
                  <Text bold>{"Date: "}</Text>
                  {observationEntry.timestamp
                    ? new Date(observationEntry.timestamp)
                        .toUTCString()
                        .slice(5, 17)
                    : ""}
                </Text>
                <Text>
                  <Text bold>Comments:</Text> {observationEntry.comments}
                </Text>
                <Text bold>Geolocation coords:</Text>
                {observationEntry.geometry?.coordinates.length > 0 ? (
                  <FlexColumn>
                    <Text>{observationEntry.geometry.coordinates[0]}</Text>
                    <Text>{observationEntry.geometry.coordinates[1]}</Text>
                  </FlexColumn>
                ) : null}
              </Section>
            )}
            { filteredMeasurementEntriesBySelectedObservation.length > 0 && (
              <SectionHeader style={{ marginTop: theme.spacing.large }}>
                ADDED MEASUREMENTS / ITEMS
              </SectionHeader>
            )}
          </>
        )}
        onEndReached={() => dispatch(fetchMeasurements({}))}
        onEndReachedThreshold={0.1}
      />
    </Screen>
  );
}
