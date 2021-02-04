import React from "react";
import styled from "../styled";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Feature } from "../models";

import { Image } from "react-native";

import { Screen } from "../components/Screen";

export default function FeatureDetailScreen() {
  const featureEntry = useSelector<RootState, Feature | undefined>(
    (state) => state.observations.selectedFeatureEntry
  );

  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      <Title>Feature details</Title>
      {featureEntry && (
        <Col>
          {Boolean(featureEntry.imageUrl) && (
            <Image
              source={{ uri: featureEntry.imageUrl }}
              style={{ width: 200, height: 200, borderRadius: 6 }}
            ></Image>
          )}
          <Text>Observer: John Smith</Text>
          <Text>Comments: {featureEntry.comments}</Text>
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

const Col = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;
