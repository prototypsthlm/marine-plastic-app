import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewObservationScreen from "../../screens/LoggedIn/Add/NewObservationScreen";
import NewFeatureScreen from "../../screens/LoggedIn/Add/NewFeatureScreen";
import FeatureTypePickerScreen from "../../screens/LoggedIn/Add/FeatureTypePickerScreen";
import CampaignPickerScreen from "../../screens/LoggedIn/List/CampaignPickerScreen";

const Stack = createStackNavigator();

export default function AddNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="newObservationScreen"
        component={NewObservationScreen}
        options={{ headerTitle: "Add new observation" }}
      />
      <Stack.Screen
        name="newFeatureScreen"
        component={NewFeatureScreen}
        options={{ headerTitle: "Add new feature" }}
      />
      <Stack.Screen
        name="featureTypePickerScreen"
        component={FeatureTypePickerScreen}
        options={{ headerTitle: "Feature Type Picker" }}
      />
      <Stack.Screen
        name="changeCampaignScreen"
        component={CampaignPickerScreen}
        options={{ headerTitle: "Change campaign" }}
      />
    </Stack.Navigator>
  );
}
