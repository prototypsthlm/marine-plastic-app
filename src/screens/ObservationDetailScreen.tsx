import React from "react";
import styled from "../styled";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../store/store";
import { Feature, Observation } from "../models";

import { Image } from "react-native";

import { Screen } from "../components/Screen";
import { NavigationProps } from "../navigation/types";
import { selectFeature } from "../store/slices/observations";

export default function ObservationDetailScreen({
  navigation,
}: NavigationProps) {
  const dispatch = useThunkDispatch();

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedEntry
  );

  const navigateToDetailScreen = (featureEntry: Feature) => {
    dispatch(selectFeature(featureEntry));
    navigation.navigate("featureDetailScreen");
  };

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
          <Text>Observer: John Smith</Text>
          <Text>
            {observationEntry.timestamp
              ? new Date(observationEntry.timestamp).toUTCString().slice(5, 17)
              : ""}
          </Text>
          <Text>Comments: {observationEntry.comments}</Text>
          <Text>Geolocation coords:</Text>
          {observationEntry.geometry?.coordinates.length > 0 ? (
            <Col>
              <Text>{observationEntry.geometry.coordinates[0]}</Text>
              <Text>{observationEntry.geometry.coordinates[1]}</Text>
            </Col>
          ) : null}

          <Title>Features</Title>

          {observationEntry.features.map((featureEntry, index) => (
            <Item
              key={index}
              onPress={() => navigateToDetailScreen(featureEntry)}
            >
              {Boolean(featureEntry.imageUrl) && (
                <Image
                  source={{ uri: featureEntry.imageUrl }}
                  style={{ width: 50, height: 50, borderRadius: 6 }}
                ></Image>
              )}
              <Text>{featureEntry.comments}</Text>
            </Item>
          ))}
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

const Item = styled.TouchableOpacity`
  padding: 10px 10px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Col = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;
