import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ObservationListScreen from "../../screens/LoggedIn/List/ObservationListScreen";
import ObservationDetailScreen from "../../screens/LoggedIn/List/ObservationDetailScreen";
import FeatureDetailScreen from "../../screens/LoggedIn/List/MeasurementDetailScreen";
import CampaignPickerScreen from "../../screens/LoggedIn/List/CampaignPickerScreen";
import ObservationEditScreen from "../../screens/LoggedIn/List/ObservationEditScreen";
import FeatureEditScreen from "../../screens/LoggedIn/List/MeasurementEditScreen";

import LitterTypePickerScreen from "../../screens/LoggedIn/Add/LitterTypePickerScreen";

const Stack = createStackNavigator();

export default function ListNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="observationListScreen"
        component={ObservationListScreen}
        options={{ headerTitle: "My observations list" }}
      />
      <Stack.Screen
        name="observationDetailScreen"
        component={ObservationDetailScreen}
        options={{ headerTitle: "Observation details" }}
      />
      <Stack.Screen
        name="observationEditScreen"
        component={ObservationEditScreen}
        options={{ headerTitle: "Edit Observation" }}
      />
      <Stack.Screen
        name="featureDetailScreen"
        component={FeatureDetailScreen}
        options={{ headerTitle: "Feature details" }}
      />
      <Stack.Screen
        name="featureEditScreen"
        component={FeatureEditScreen}
        options={{ headerTitle: "Edit Feature" }}
      />
      <Stack.Screen
        name="featureTypePickerScreen"
        component={LitterTypePickerScreen}
        options={{ headerTitle: "Feature Type Picker" }}
      />
      <Stack.Screen
        name="campaignPickerScreen"
        component={CampaignPickerScreen}
        options={{ headerTitle: "Campaign Picker" }}
      />
    </Stack.Navigator>
  );
}
