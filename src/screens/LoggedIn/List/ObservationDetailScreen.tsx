import React, { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import {
  Feature,
  FeatureImage,
  FeatureType,
  Observation,
  User,
} from "../../../models";

import { Image } from "react-native";

import { Screen } from "../../../components/Screen";
import { NavigationProps } from "../../../navigation/types";
import { fetchFeatures, selectFeature } from "../../../store/slices/features";
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

export default function ObservationDetailScreen({
  navigation,
}: NavigationProps) {
  const dispatch = useThunkDispatch();

  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const username = `${user?.givenNames} ${user?.familyName}`;

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

  const featureEntries = useSelector<RootState, Array<Feature>>(
    (state) => state.features.featureEntries
  );

  const filteredFeatureEntriesBySelectedObservation = featureEntries.filter(
    (f) => f.observationId === observationEntry?.id
  );

  const featureTypes = useSelector<RootState, Array<FeatureType>>(
    (state) => state.features.featureTypes
  );

  const featureImages = useSelector<RootState, Array<FeatureImage>>(
    (state) => state.features.featureImages
  );

  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );

  useEffect(() => {
    dispatch(fetchFeatures());
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicHeaderButtons>
          <Item
            title="Edit"
            onPress={() => navigation.navigate("observationEditScreen")}
          />
        </BasicHeaderButtons>
      ),
    });
  }, [navigation]);

  const getFeatureTypeById = (id: string) =>
    featureTypes.find((ft) => ft.id === id);

  const getFeatureImage = (feature: Feature) => {
    const onlineImage: FeatureImage | undefined =
      isOnline && feature?.featureImages && feature?.featureImages?.length > 0
        ? feature?.featureImages[0]
        : undefined;
    const image: FeatureImage | undefined =
      onlineImage || featureImages.find((fi) => fi.featureId === feature?.id);
    return image?.url || "";
  };

  const navigateToDetailScreen = (featureEntry: Feature) => {
    dispatch(selectFeature(featureEntry));
    navigation.navigate("featureDetailScreen");
  };

  return (
    <Screen scroll>
      {observationEntry && (
        <>
          <Section>
            <Text>
              <Text bold>Observer:</Text> {username}
            </Text>
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
          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            ADDED FEATURES / ITEMS
          </SectionHeader>

          {filteredFeatureEntriesBySelectedObservation.map(
            (featureEntry, index) => (
              <ListItem
                key={index}
                onPress={() => navigateToDetailScreen(featureEntry)}
              >
                {getFeatureImage(featureEntry) ? (
                  <Image
                    source={{ uri: getFeatureImage(featureEntry) }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 6,
                      marginRight: 12,
                    }}
                  ></Image>
                ) : null}
                <Text>
                  {getFeatureTypeById(featureEntry.featureTypeId)?.name}
                </Text>
              </ListItem>
            )
          )}
        </>
      )}
    </Screen>
  );
}
