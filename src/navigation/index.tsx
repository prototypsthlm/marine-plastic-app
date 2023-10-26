import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useSelector } from "react-redux";
import { firebaseAuth } from "../services/firebaseAuth";

import { navigationRef } from "../services/navigation";
import { setUserWithNewToken } from "../store/slices/session";
import { RootState, useThunkDispatch } from "../store/store";

import BottomTabNavigator from "./BottomTabNavigator";
import { LoggedOutStackNavigator } from "./LoggedOutStackNavigator";

import NetInfo from "@react-native-community/netinfo";
import { setIsActive, setIsOnline } from "../store/slices/ui";
import useSync from "../hooks/useSync";
import { theme } from "../theme";
import { loadSettings } from "../store/slices/ui/actions";
import { useLogoutDetection } from "../hooks/useLogoutDetection";

const CHECK_CONNECTION_INTERVAL_MS = 5000;

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

  const isActive = useSelector((state: RootState) => state.ui.isActive);
  const isOnline = useSelector((state: RootState) => state.ui.isOnline);

  const isLoggedOut = useLogoutDetection({ isOnline });

  const setUpPeriodicNetworkCheck = async (isOnline: boolean) => {
    const noOp = () => {};
    if (!isOnline) {
      return await NetInfo.fetch()
        .then(
          (netInfoState) =>
            netInfoState.isConnected && netInfoState.isInternetReachable
        )
        .then((isConnected) => {
          if (isConnected) {
            dispatch(setIsOnline(isConnected));
            return noOp;
          } else {
            const periodicNetworkCheck = () => {
              NetInfo.fetch().then((netInfoState) =>
                dispatch(setIsOnline(netInfoState.isConnected))
              );
            };
            const unsubscribePeriodicNetworkCheck = setInterval(
              periodicNetworkCheck,
              CHECK_CONNECTION_INTERVAL_MS
            );
            return () => {
              clearInterval(unsubscribePeriodicNetworkCheck);
            };
          }
        });
    } else {
      return Promise.resolve(noOp);
    }
  };

  useEffect(() => {
    dispatch(loadSettings());

    const unsubscribeFirebaseAuth = firebaseAuth.onAuthStateChanged(function (
      user
    ) {
      if (user && isOnline) dispatch(setUserWithNewToken());
    });

    const unsubscribeNetInfo = NetInfo.addEventListener((state) =>
      dispatch(setIsOnline(state.isConnected))
    );

    const appStateListener = (newState: AppStateStatus) => {
      if (isActive && newState.match(/background|inactive/)) {
        dispatch(setIsActive(false));
      } else if (!isActive && newState.match(/active/)) {
        dispatch(setIsActive(true));
        NetInfo.fetch().then((netInfoState) =>
          dispatch(setIsOnline(netInfoState.isConnected))
        );
      }
    };
    AppState.addEventListener("change", appStateListener);

    const unsubscribePeriodicNetworkCheck = setUpPeriodicNetworkCheck(isOnline);

    return () => {
      unsubscribeFirebaseAuth();
      unsubscribeNetInfo();
      AppState.removeEventListener("change", appStateListener);
      unsubscribePeriodicNetworkCheck.then((fn) => fn());
    };
  }, [isActive, isOnline]);

  // Custom sync hook
  useSync();

  if (isLoggedOut) return <LoggedOutStackNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
