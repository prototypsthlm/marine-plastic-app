import * as React from "react";
import styled from "../styled";
import { useDispatch, useSelector } from "react-redux";
import { setActiveScreen } from "../store/slices/ui";
import { RootState } from "../store/store";
import { Observation } from "../store/slices/observations/types";

import { Image } from "react-native";

export default function ObservationListScreen() {
  const dispatch = useDispatch();
  dispatch(setActiveScreen("list"));

  const observations = useSelector<RootState, Array<Observation>>(
    (state) => state.observations.observations
  );

  return (
    <Screen>
      <Title>Image/Observer</Title>
      {observations.map((observation, index) => (
        <Item key={index}>
          {observation.image && (
            <Image
              source={{ uri: observation.image }}
              style={{ width: 50, height: 50 }}
            />
          )}
          <Text>{observation.observer}</Text>
          <Text>{observation.comment}</Text>
        </Item>
      ))}
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.medium}px;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;

const Item = styled.View`
  padding: 10px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;
