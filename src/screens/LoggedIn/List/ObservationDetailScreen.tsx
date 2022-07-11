import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import {
  Measurement,
  Observation,
  ObservationImage,
  User,
} from "../../../models";
import { visualInspectionTypes } from "../../../components/VisualInspectionForm/VisualInspectionForm";

import {
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

import { Screen } from "../../../components/Screen";
import { NavigationProps } from "../../../navigation/types";
import {
  ListItem,
  Section,
  SectionHeader,
  Text,
} from "../../../components/elements";
import { theme } from "../../../theme";
import { Item } from "react-navigation-header-buttons";
import BasicHeaderButtons from "../../../components/BasicHeaderButtons";
import {
  fetchObservationCreator,
} from "../../../store/slices/observations";
import {
  fetchMeasurements,
  selectMeasurement,
} from "../../../store/slices/measurements";
import {
  getQuantityFromMeasurement,
  getUnitsLabel,
  getUnitValueFromMeasurement,
} from "../../../components/MeasurementForm/utils";

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
  );

  const observationCreator = observationUsers.find(
    (x) => x.id === observationEntry?.creatorId
  );

  const filteredMeasurementEntriesBySelectedObservation =
    measurementEntries.filter((m) => m.observationId === observationEntry?.id);

  const observationImages = useSelector<RootState, Array<ObservationImage>>(
    (state) => state.observations.observationImages
  );

  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );

  const belongsToCurrentUser =
    user && observationEntry && user.id === observationEntry.creatorId;

  const getObserverName = (creatorId: string): string | undefined => {
    if (creatorId !== user?.id) {
      if (observationCreator)
        return `${observationCreator.givenNames} ${observationCreator?.familyName}`;
      else return "";
    }
    return `${user?.givenNames} ${user?.familyName}`;
  };

  useEffect(() => {
    if (observationEntry && observationEntry.creatorId !== user?.id) {
      dispatch(
        fetchObservationCreator({ creatorId: observationEntry.creatorId })
      );
    }
    dispatch(fetchMeasurements({}));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (!belongsToCurrentUser) return null;

        return (
          <BasicHeaderButtons>
            <Item
              title="Edit"
              onPress={() => navigation.navigate("observationEditScreen")}
            />
          </BasicHeaderButtons>
        );
      },
    });
  }, [navigation]);

  const getObservationImage = (observation: Observation) => {
    const onlineImage: ObservationImage | undefined =
      isOnline && observation?.images && observation.images.length > 0
        ? observation?.images[0]
        : undefined;
    const image: ObservationImage | undefined =
      onlineImage ||
      observationImages.find((fi) => fi.observationId === observation?.id);
    return image?.url || "";
  };

  const navigateToDetailScreen = (measurementEntry: Measurement) => {
    dispatch(selectMeasurement(measurementEntry));
    navigation.navigate("featureDetailScreen");
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: Measurement;
    index: number;
  }) => (
    <ListItem onPress={() => navigateToDetailScreen(item)}>
      <Text style={{ flexGrow: 1 }}>
        {getQuantityFromMeasurement(item)}{" "}
        {getUnitsLabel(getUnitValueFromMeasurement(item))}
      </Text>
      <Text bold style={{ flexGrow: 0 }}>
        {item.material ? item.material : "Unspecified"}
      </Text>
    </ListItem>
  );

  const refreshingMeasurementsList = useSelector<RootState, boolean>(
    (state) => state.measurements.refreshing
  );

  const [modalVisible, setModalVisible] = useState(false);

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
            {observationEntry ? (
              <Section>
                <Modal animationType="fade" visible={modalVisible}>
                  {getObservationImage(observationEntry) !== "" && (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setModalVisible(false);
                      }}
                    >
                      <Image
                        source={{ uri: getObservationImage(observationEntry) }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableWithoutFeedback>
                  )}
                </Modal>
                {getObservationImage(observationEntry) !== "" && (
                  <>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: getObservationImage(observationEntry) }}
                        style={{ width: "100%", height: 200 }}
                      />
                    </TouchableWithoutFeedback>
                  </>
                )}
              </Section>
            ) : null}

            {observationEntry ? (
              <>
                <SectionHeader style={{ marginTop: theme.spacing.medium }}>
                  OBSERVER
                </SectionHeader>

                <Section>
                  <Text style={styles.detailsView}>
                    Observed by{" "}
                    <Text bold>
                      {getObserverName(observationEntry.creatorId)}
                    </Text>
                  </Text>

                  <Text style={styles.detailsView}>
                    Date{" "}
                    <Text bold>
                      {observationEntry.timestamp
                        ? new Date(observationEntry.timestamp)
                            .toUTCString()
                            .slice(5, 17)
                        : ""}
                    </Text>
                  </Text>

                  {observationEntry.geometry?.coordinates.length > 0 ? (
                    <Text style={styles.detailsView}>
                      Location{" "}
                      <Text bold>
                        Long{" "}
                        {Number(
                          observationEntry.geometry.coordinates[0]
                        ).toFixed(2)}{" "}
                        | Lat{" "}
                        {Number(
                          observationEntry.geometry.coordinates[1]
                        ).toFixed(2)}
                      </Text>
                    </Text>
                  ) : null}
                </Section>
              </>
            ) : null}

            {observationEntry ? (
              <>
                <SectionHeader style={{ marginTop: theme.spacing.medium }}>
                  DETAILS
                </SectionHeader>
                <Section>
                  {observationEntry.class ? (
                    <Text style={styles.detailsView}>
                      Visual Inspection Type{" "}
                      <Text bold>
                        {
                          visualInspectionTypes.find(
                            (item) => item.value === observationEntry.class
                          )?.label
                        }
                      </Text>
                    </Text>
                  ) : null}
                  {observationEntry.depthM ? (
                    <Text style={styles.detailsView}>
                      Depth <Text bold> {observationEntry.depthM} m</Text>
                    </Text>
                  ) : null}
                  {observationEntry.estimatedAreaAboveSurfaceM2 ? (
                    <Text style={styles.detailsView}>
                      Estimated area above surface{" "}
                      <Text bold>
                        {observationEntry.estimatedAreaAboveSurfaceM2} m2
                      </Text>
                    </Text>
                  ) : null}
                  {observationEntry.isControlled ? (
                    <Text style={styles.detailsView}>
                      Controller/experimental target{" "}
                      <Text bold>
                        {observationEntry.isControlled ? "Yes" : "No"}
                      </Text>
                    </Text>
                  ) : null}
                  {observationEntry.estimatedPatchAreaM2 ? (
                    <Text style={styles.detailsView}>
                      Estimated patch area{" "}
                      <Text bold>
                        {observationEntry.estimatedPatchAreaM2} m2
                      </Text>
                    </Text>
                  ) : null}
                  {observationEntry.estimatedFilamentLengthM ? (
                    <Text style={styles.detailsView}>
                      Estimated filament length{" "}
                      <Text bold>
                        {observationEntry.estimatedFilamentLengthM} m
                      </Text>
                    </Text>
                  ) : null}
                </Section>
              </>
            ) : null}

            {observationEntry?.comments ? (
              <>
                <SectionHeader style={{ marginTop: theme.spacing.medium }}>
                  COMMENTS
                </SectionHeader>

                <Section>
                  <Text style={styles.detailsView}>
                    {observationEntry.comments}
                  </Text>
                </Section>
              </>
            ) : null}

            {filteredMeasurementEntriesBySelectedObservation.length > 0 && (
              <SectionHeader style={{ marginTop: theme.spacing.medium }}>
                QUANTITY AND TYPE
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

const styles = StyleSheet.create({
  detailsView: {
    lineHeight: 24,
  },
});
