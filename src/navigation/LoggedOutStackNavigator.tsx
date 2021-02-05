import React from "react";
import { EmailPasswordLoginScreen } from "../screens/LoggedOut/EmailPasswordLoginScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "../theme";

const Stack = createStackNavigator();

export const LoggedOutStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="loggedOutStart"
    headerMode="screen"
    screenOptions={{
      headerTransparent: true,
      cardStyle: { backgroundColor: theme.color.palette.dark },
      gestureEnabled: true,
    }}
  >
    <Stack.Screen
      name="emailPasswordLogin"
      component={EmailPasswordLoginScreen}
      options={{
        title: "",
        headerTransparent: true,
      }}
    />
  </Stack.Navigator>
);
