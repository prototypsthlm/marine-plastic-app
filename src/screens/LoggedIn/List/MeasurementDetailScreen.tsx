import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Measurement, User } from "../../../models";

import { Screen } from "../../../components/Screen";
import { FlexColumn, Section, Text } from "../../../components/elements";
import { NavigationProps } from "../../../navigation/types";
import BasicHeaderButtons from "../../../components/BasicHeaderButtons";
import { Item } from "react-navigation-header-buttons";
import {
  getQuantityFromMeasurement,
  getUnitsLabel,
  getUnitValueFromMeasurement,
} from "../../../components/MeasurementForm/utils";

export default function MeasurementDetailScreen({
  navigation,
}: NavigationProps) {

  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const measurementEntry = useSelector<RootState, Measurement | undefined>(
    (state) => state.measurements.selectedMeasurementEntry
  );

  const belongsToCurrentUser =
    user && measurementEntry && user.id === measurementEntry.creatorId;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (!belongsToCurrentUser) return null;

        return (
          <BasicHeaderButtons>
            <Item
              title="Edit"
              onPress={() => navigation.navigate("featureEditScreen")}
            />
          </BasicHeaderButtons>
        );
      },
    });
  }, [navigation]);

  const fields = [
    {
      label: "Quantity: ",
      value: measurementEntry && getQuantityFromMeasurement(measurementEntry),
    },
    {
      label: "Units: ",
      value:
        measurementEntry &&
        getUnitsLabel(getUnitValueFromMeasurement(measurementEntry)),
    },
    {
      label: "Is Collected: ",
      value: measurementEntry?.isCollected ? "Yes" : "No",
    },
    {
      label: "Is Approximate: ",
      value: measurementEntry?.isApproximate ? "Yes" : "No",
    },
    {
      label: "Litter Material: ",
      value: measurementEntry?.material || "Unspecified",
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
