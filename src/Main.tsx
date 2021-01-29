import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { ThemeProvider } from "./styled";
import { theme } from "./theme";
import { Provider } from "react-redux";
import store from "./store/store";

import useCachedResources from "./hooks/useCachedResources";
import { useOverTheAirUpdate } from "./hooks/useOverTheAirUpdate";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  // Check and apply OTA updates
  const isUpdated = useOverTheAirUpdate();

  if (!isLoadingComplete || !isUpdated) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ThemeProvider theme={theme}>
            <Navigation />
            <StatusBar />
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    );
  }
}
