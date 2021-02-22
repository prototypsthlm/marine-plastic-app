import React from "react";
import styled from "../../styled";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Feature, FeatureImage } from "../../models";

import { Image } from "react-native";

import { Screen } from "../../components/Screen";
import { FlexColumn, Section, Text } from "../../components/elements";

export default function FeatureDetailScreen() {
  const featureEntry = useSelector<RootState, Feature | undefined>(
    (state) => state.features.selectedFeatureEntry
  );

  const featureImages = useSelector<RootState, Array<FeatureImage>>(
    (state) => state.features.featureImages
  );

  const image: FeatureImage | undefined = featureImages.find(
    (fi) => fi.featureId === featureEntry?.id
  );

  const fields = [
    { label: "Observer: ", value: "John Smith" },
    { label: "Comments: ", value: featureEntry?.comments },
    { label: "Quantity: ", value: featureEntry?.quantity },
    { label: "Quantity units: ", value: featureEntry?.quantityUnits },
    {
      label: "Estimated Weight (Kg): ",
      value: featureEntry?.estimatedWeightKg,
    },
    { label: "Estimated Size (m2): ", value: featureEntry?.estimatedSizeM2 },
    {
      label: "Estimated Volume (m3): ",
      value: featureEntry?.estimatedVolumeM3,
    },
    { label: "Depth (m): ", value: featureEntry?.depthM },
    { label: "Is Absence: ", value: featureEntry?.isAbsence ? "Yes" : "No" },
    {
      label: "Is Collected: ",
      value: featureEntry?.isCollected ? "Yes" : "No",
    },
  ];

  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      {featureEntry && (
        <>
          {Boolean(image) && (
            <Image
              source={{ uri: image?.url }}
              style={{ width: "100%", height: 400 }}
            ></Image>
          )}
          <Section>
            <FlexColumn>
              {fields.map((item, index) => (
                <Text key={index}>
                  <Text bold>{item.label}</Text>
                  {item.value}
                </Text>
              ))}
            </FlexColumn>
          </Section>
        </>
      )}
    </Screen>
  );
}
