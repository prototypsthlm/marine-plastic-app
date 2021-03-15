import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import { Measurement } from "../../../models";

import { Alert, Image } from "react-native";

import { Screen } from "../../../components/Screen";
import { FlexColumn, Section, Text } from "../../../components/elements";
import { NavigationProps } from "../../../navigation/types";
import BasicHeaderButtons from "../../../components/BasicHeaderButtons";
import { Item } from "react-navigation-header-buttons";
import { theme } from "../../../theme";
import { deleteMeasurement } from "../../../store/slices/measurements";

export default function FeatureDetailScreen({ navigation }: NavigationProps) {
  const dispatch = useThunkDispatch();

  const measurementEntry = useSelector<RootState, Measurement | undefined>(
    (state) => state.measurements.selectedMeasurementEntry
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicHeaderButtons>
          <Item
            title="Edit"
            onPress={() => navigation.navigate("featureEditScreen")}
          />
          <Item
            title="Delete"
            iconName="ios-trash"
            color={theme.color.palette.red}
            onPress={() => deleteAlert()}
          />
        </BasicHeaderButtons>
      ),
    });
  }, [navigation]);

  const deleteAlert = () =>
    Alert.alert(
      "Delete feature?",
      "This feature will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => dispatch(deleteMeasurement()),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );

  const fields = [
    { label: "Observer: ", value: "John Smith" },
    { label: "Comments: ", value: measurementEntry?.comments },
    { label: "Quantity: ", value: measurementEntry?.quantity },
    { label: "Quantity units: ", value: measurementEntry?.quantityUnits },
    {
      label: "Estimated Weight (Kg): ",
      value: measurementEntry?.estimatedWeightKg,
    },
    { label: "Estimated Size (m2): ", value: measurementEntry?.estimatedSizeM2 },
    {
      label: "Estimated Volume (m3): ",
      value: measurementEntry?.estimatedVolumeM3,
    },
    { label: "Depth (m): ", value: measurementEntry?.depthM },
    {
      label: "Is Collected: ",
      value: measurementEntry?.isCollected ? "Yes" : "No",
    },
  ];

  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      {measurementEntry && (
        <>
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
