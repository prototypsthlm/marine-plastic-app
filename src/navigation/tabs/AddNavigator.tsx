import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewObservationScreen from "../../screens/LoggedIn/Add/NewObservationScreen";
import NewFeatureScreen from "../../screens/LoggedIn/Add/NewMeasurementScreen";
import LitterTypePickerScreen from "../../screens/LoggedIn/Add/LitterTypePickerScreen";
import CampaignPickerScreen from "../../screens/LoggedIn/List/CampaignPickerScreen";
import LogoutButton from "../../components/LogoutButton";
import SettingsHelperButton from "../../components/SettingsHelperButton";

const Stack = createStackNavigator();

export default function AddNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="newObservationScreen"
        component={NewObservationScreen}
        options={{
          headerTitle: "Submit observation",
          headerRight: LogoutButton,
          headerLeft: SettingsHelperButton
        }}
      />
      <Stack.Screen
        name="newFeatureScreen"
        component={NewFeatureScreen}
        options={{ headerTitle: "Add measurement to observation" }}
      />
      <Stack.Screen
        name="featureTypePickerScreen"
        component={LitterTypePickerScreen}
        options={{ headerTitle: "Litter Type Picker" }}
      />
      <Stack.Screen
        name="changeCampaignScreen"
        component={CampaignPickerScreen}
        options={{ headerTitle: "Change campaign" }}
      />
    </Stack.Navigator>
  );
}
