import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { firebaseAuth } from "../services/firebaseAuth";

import { navigationRef } from "../services/navigation";
import { selectIsLoggedIn, setUserWithNewToken } from "../store/slices/session";
import { useThunkDispatch } from "../store/store";

import BottomTabNavigator from "./BottomTabNavigator";
import { LoggedOutStackNavigator } from "./LoggedOutStackNavigator";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<{
  Root: undefined;
}>();

function RootNavigator() {
  const dispatch = useThunkDispatch();

  useEffect(
    () =>
      firebaseAuth.onAuthStateChanged(function (user) {
        if (user) dispatch(setUserWithNewToken());
      }),
    []
  );

  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) return <LoggedOutStackNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
