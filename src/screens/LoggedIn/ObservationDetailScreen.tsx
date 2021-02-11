import React from "react";
import styled from "../../styled";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../store/store";
import { Feature, FeatureType, Observation } from "../../models";

import { Image } from "react-native";

import { Screen } from "../../components/Screen";
import { NavigationProps } from "../../navigation/types";
import { selectFeature } from "../../store/slices/observations";
import { FlexColumn, ListItem, Section, Text } from "../../components/elements";

export default function ObservationDetailScreen({
  navigation,
}: NavigationProps) {
  const dispatch = useThunkDispatch();

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

  const featureTypes = useSelector<RootState, Array<FeatureType>>(
    (state) => state.observations.featureTypes
  );

  const getFeatureTypeById = (id: string) =>
    featureTypes.find((ft) => ft.id === id);

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
              <Text bold>Observer:</Text> John Smith
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
          <Title>Added Features / Items</Title>

          {observationEntry.features.map((featureEntry, index) => (
            <ListItem
              key={index}
              onPress={() => navigateToDetailScreen(featureEntry)}
            >
              {Boolean(featureEntry.imageUrl) && (
                <Image
                  source={{ uri: featureEntry.imageUrl }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 6,
                    marginRight: 12,
                  }}
                ></Image>
              )}
              <Text>
                {getFeatureTypeById(featureEntry.featureTypeId)?.name}
              </Text>
            </ListItem>
          ))}
        </>
      )}
    </Screen>
  );
}

const Title = styled.Text`
  margin: ${(props) => props.theme.spacing.medium}px;
  margin-left: ${(props) => props.theme.spacing.medium}px;
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;
