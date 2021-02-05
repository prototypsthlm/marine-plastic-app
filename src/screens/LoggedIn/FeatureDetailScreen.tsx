import React from "react";
import styled from "../../styled";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Feature } from "../../models";

import { Image } from "react-native";

import { Screen } from "../../components/Screen";
import { FlexColumn, Section, Text } from "../../components/elements";

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
      {featureEntry && (
        <>
          {Boolean(featureEntry.imageUrl) && (
            <Image
              source={{ uri: featureEntry.imageUrl }}
              style={{ width: "100%", height: 400 }}
            ></Image>
          )}
          <Section>
            <FlexColumn>
              <Text>
                <Text bold>Observer:</Text> John Smith
              </Text>
              <Text>
                <Text bold>Comments:</Text> {featureEntry.comments}
              </Text>
            </FlexColumn>
          </Section>
        </>
      )}
    </Screen>
  );
}
