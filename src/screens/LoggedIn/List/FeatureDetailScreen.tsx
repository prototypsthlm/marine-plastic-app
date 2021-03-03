import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Feature, FeatureImage } from "../../../models";

import { Image } from "react-native";

import { Screen } from "../../../components/Screen";
import { FlexColumn, Section, Text } from "../../../components/elements";
import { NavigationProps } from "../../../navigation/types";
import BasicHeaderButtons from "../../../components/BasicHeaderButtons";
import { Item } from "react-navigation-header-buttons";

export default function FeatureDetailScreen({ navigation }: NavigationProps) {
  const featureEntry = useSelector<RootState, Feature | undefined>(
    (state) => state.features.selectedFeatureEntry
  );

  const featureImages = useSelector<RootState, Array<FeatureImage>>(
    (state) => state.features.featureImages
  );

  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicHeaderButtons>
          <Item
            title="Edit"
            onPress={() => navigation.navigate("featureEditScreen")}
          />
        </BasicHeaderButtons>
      ),
    });
  }, [navigation]);

  const onlineImage: FeatureImage | undefined =
    isOnline &&
    featureEntry?.featureImages &&
    featureEntry?.featureImages?.length > 0
      ? featureEntry?.featureImages[0]
      : undefined;
  const image: FeatureImage | undefined =
    onlineImage ||
    featureImages.find((fi) => fi.featureId === featureEntry?.id);

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
