import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ObservationMapScreen from "../../screens/LoggedIn/Map/ObservationMapScreen";
import LogoutButton from "../../components/LogoutButton";

const Stack = createStackNavigator();

export default function MapNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="observationMapScreen"
        component={ObservationMapScreen}
        options={{ headerTitle: "My observations map", headerRight: LogoutButton }}
      />
    </Stack.Navigator>
  );
}
