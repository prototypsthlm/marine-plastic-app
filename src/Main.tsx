import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./styled";
import { theme } from "./theme";
import { Provider } from "react-redux";
import store from "./store/store";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <Navigation />
            <StatusBar />
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    );
  }
}
