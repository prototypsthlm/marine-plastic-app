import * as React from "react";
import styled from "../styled";

export default function ObservationMapScreen() {
  return (
    <Screen>
      <Text>Here goes a map</Text>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;
