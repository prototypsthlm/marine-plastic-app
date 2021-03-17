import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { firebaseAuth } from "../services/firebaseAuth";

import { navigationRef } from "../services/navigation";
import { selectIsLoggedIn, setUserWithNewToken } from "../store/slices/session";
import { RootState, useThunkDispatch } from "../store/store";

import BottomTabNavigator from "./BottomTabNavigator";
import { LoggedOutStackNavigator } from "./LoggedOutStackNavigator";

import NetInfo from "@react-native-community/netinfo";
import { setIsOnline } from "../store/slices/ui";
import { syncOfflineEntries } from "../store/slices/observations";
import { theme } from '../theme';

const OceanScanTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    card: theme.color.palette.dark,
    primary: theme.color.palette.cyan,
    text: theme.color.palette.white
  },
};

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef} theme={OceanScanTheme}>
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
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isSyncing = useSelector<RootState, boolean>(state => (state.ui.isSyncing));

  const handleNetworkChange = useCallback((state) => {
    // Don't start syncing any entries before logged in and has token 
    if (state.isConnected && isLoggedIn) dispatch(syncOfflineEntries());
    dispatch(setIsOnline(state.isConnected));
  },[isLoggedIn, isSyncing])

  useEffect(() => {
    const unsubscribeFirebaseAuth = firebaseAuth.onAuthStateChanged(function (
      user
    ) {
      if (user) dispatch(setUserWithNewToken());
    });
    const unsubscribeNetInfo = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      unsubscribeFirebaseAuth();
      unsubscribeNetInfo();
    };
  }, []);

  if (!isLoggedIn) return <LoggedOutStackNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator}/>
    </Stack.Navigator>
  );
}
