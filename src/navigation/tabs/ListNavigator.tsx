import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ObservationListScreen from "../../screens/LoggedIn/List/ObservationListScreen";
import ObservationDetailScreen from "../../screens/LoggedIn/List/ObservationDetailScreen";
import FeatureDetailScreen from "../../screens/LoggedIn/List/FeatureDetailScreen";
import CampaignPickerScreen from "../../screens/LoggedIn/List/CampaignPickerScreen";
import ObservationEditScreen from "../../screens/LoggedIn/List/ObservationEditScreen";

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
        name="campaignPickerScreen"
        component={CampaignPickerScreen}
        options={{ headerTitle: "Campaign Picker" }}
      />
    </Stack.Navigator>
  );
}
