import React from "react";
import styled from "../styled";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Observation } from "../store/slices/observations/types";

import { Image } from "react-native";

import { Screen } from "../components/Screen";

export default function ObservationDetailScreen() {
  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedEntry
  );

  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      <Title>Observation details</Title>
      {observationEntry && (
        <Col>
          {observationEntry.image ? (
            <Image
              source={{ uri: observationEntry.image }}
              style={{ width: 200, height: 200 }}
            />
          ) : null}
          <Text>Observer: {observationEntry.observer}</Text>
          <Text>
            {observationEntry.timestamp
              ? new Date(observationEntry.timestamp).toUTCString().slice(5, 17)
              : ""}
          </Text>
          <Text>Comment: {observationEntry.comment}</Text>
          <Text>Geolocation coords:</Text>
          <Text>{observationEntry.location?.latitude}</Text>
          <Text>{observationEntry.location?.longitude}</Text>
        </Col>
      )}
    </Screen>
  );
}

const Title = styled.Text`
  margin-top: ${(props) => props.theme.spacing.medium}px;
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;

const Item = styled.View`
  padding: 10px 10px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Col = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;
