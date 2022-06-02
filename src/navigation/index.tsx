import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native"
import { useSelector } from "react-redux";
import { firebaseAuth } from "../services/firebaseAuth";

import { navigationRef } from "../services/navigation";
import { selectIsLoggedIn, setUserWithNewToken } from "../store/slices/session";
import { RootState, useThunkDispatch } from "../store/store";

import BottomTabNavigator from "./BottomTabNavigator";
import { LoggedOutStackNavigator } from "./LoggedOutStackNavigator";

import NetInfo from "@react-native-community/netinfo";
import { setIsActive, setIsOnline } from "../store/slices/ui";
import useSync from "../hooks/useSync";
import { theme } from "../theme";

const OceanScanTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    card: theme.color.palette.dark,
    primary: theme.color.palette.cyan,
    text: theme.color.palette.white,
  },
};

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
  return (
      <NavigationContainer ref={navigationRef} theme={OceanScanTheme}>
        <RootNavigator/>
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
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isActive = useSelector((state: RootState) => state.ui.isActive)

  useEffect(() => {
    const unsubscribeFirebaseAuth = firebaseAuth.onAuthStateChanged(function (
        user,
    ) {
      if (user) dispatch(setUserWithNewToken());
    });

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => dispatch(setIsOnline(state.isConnected)));

    const appStateListener = (newState: AppStateStatus) => {
      if (isActive && newState.match(/background|inactive/)) {
        dispatch(setIsActive(false))
      } else if (!isActive && newState.match(/active/)) {
        dispatch(setIsActive(true))
        NetInfo.fetch().then(netInfoState => dispatch(setIsOnline(netInfoState.isConnected)))
      }
    }
    AppState.addEventListener("change", appStateListener)

    return () => {
      unsubscribeFirebaseAuth();
      unsubscribeNetInfo();
      AppState.removeEventListener("change", appStateListener)
    };
  }, [isActive]);

  // Custom sync hook
  useSync();

  if (!isLoggedIn) return <LoggedOutStackNavigator/>;

  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Root" component={BottomTabNavigator}/>
      </Stack.Navigator>
  );
}
