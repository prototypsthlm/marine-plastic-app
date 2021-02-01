import React, { useEffect } from "react";
import styled from "../styled";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../store/store";
import { Observation } from "../store/slices/observations/types";

import { Image } from "react-native";

import { Screen } from "../components/Screen";
import { fetchAllObservations } from "../store/slices/observations";

export default function ObservationListScreen() {
  const dispatch = useThunkDispatch();

  const observationsEntries = useSelector<RootState, Array<Observation>>(
    (state) => state.observations.entries
  );

  useEffect(() => {
    dispatch(fetchAllObservations());
  }, []);

  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      <Title>Image/Observer/LatLong</Title>
      {observationsEntries.map((observationEntry, index) => (
        <Item key={index}>
          {observationEntry.image ? (
            <Image
              source={{ uri: observationEntry.image }}
              style={{ width: 50, height: 50 }}
            />
          ) : null}
          <Col>
            <Text>{observationEntry.observer}</Text>
            <Text>
              {observationEntry.timestamp
                ? new Date(observationEntry.timestamp)
                    .toUTCString()
                    .slice(5, 17)
                : ""}
            </Text>
          </Col>
          <Col>
            <Text>{observationEntry.location?.latitude}</Text>
            <Text>{observationEntry.location?.longitude}</Text>
          </Col>
        </Item>
      ))}
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
