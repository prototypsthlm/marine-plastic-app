import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ObservationListScreen from "../../screens/LoggedIn/List/ObservationListScreen";
import ObservationDetailScreen from "../../screens/LoggedIn/List/ObservationDetailScreen";
import MeasurementDetailScreen from "../../screens/LoggedIn/List/MeasurementDetailScreen";
import CampaignPickerScreen from "../../screens/LoggedIn/List/CampaignPickerScreen";
import ObservationEditScreen from "../../screens/LoggedIn/List/ObservationEditScreen";
import MeasurementEditScreen from "../../screens/LoggedIn/List/MeasurementEditScreen";

import LitterTypePickerScreen from "../../screens/LoggedIn/Add/LitterTypePickerScreen";
import LogoutButton from "../../components/LogoutButton";
import SettingsHelperButton from "../../components/SettingsHelperButton";

const Stack = createStackNavigator();

export default function ListNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="observationListScreen"
        component={ObservationListScreen}
        options={{
          headerTitle: "All campaign observations",
          headerRight: LogoutButton,
          headerLeft: SettingsHelperButton
        }}
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
        component={MeasurementDetailScreen}
        options={{ headerTitle: "Measurement details" }}
      />
      <Stack.Screen
        name="featureEditScreen"
        component={MeasurementEditScreen}
        options={{ headerTitle: "Edit Measurement" }}
      />
      <Stack.Screen
        name="featureTypePickerScreen"
        component={LitterTypePickerScreen}
        options={{ headerTitle: "Litter Type Picker" }}
      />
      <Stack.Screen
        name="campaignPickerScreen"
        component={CampaignPickerScreen}
        options={{ headerTitle: "Campaign Picker" }}
      />
    </Stack.Navigator>
  );
}
