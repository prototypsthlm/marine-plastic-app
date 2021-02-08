import React, { useEffect } from "react";
import styled from "../../styled";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../store/store";
import { Observation } from "../../models";

import { Image } from "react-native";

import { Screen } from "../../components/Screen";
import {
  fetchAllFeatureTypes,
  fetchAllObservations,
  selectObservation,
} from "../../store/slices/observations";
import { NavigationProps } from "../../navigation/types";
import { FlexColumn, ListItem, Text } from "../../components/elements";

export default function ObservationListScreen({ navigation }: NavigationProps) {
  const dispatch = useThunkDispatch();

  const observationsEntries = useSelector<RootState, Array<Observation>>(
    (state) => state.observations.entries
  );

  useEffect(() => {
    dispatch(fetchAllFeatureTypes());
    dispatch(fetchAllObservations());
  }, []);

  const navigateToDetailScreen = (observationEntry: Observation) => {
    dispatch(selectObservation(observationEntry));
    navigation.navigate("observationDetailScreen");
  };

  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      {observationsEntries.map((observationEntry, index) => (
        <ListItem
          key={index}
          onPress={() => navigateToDetailScreen(observationEntry)}
        >
          {observationEntry.features.length > 0 ? (
            <Image
              source={{ uri: observationEntry.features[0].imageUrl }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 6,
                marginRight: 12,
              }}
            />
          ) : null}
          <FlexColumn>
            <Text>John Smith</Text>
            <Text>
              {observationEntry.timestamp
                ? new Date(observationEntry.timestamp)
                    .toUTCString()
                    .slice(5, 17)
                : ""}
            </Text>
          </FlexColumn>
        </ListItem>
      ))}
    </Screen>
  );
}
