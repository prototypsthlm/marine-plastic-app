/// <reference path="global.d.ts"/>
import React from "react";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { ThemeProvider } from "./styled";
import { theme } from "./theme";
import { Provider } from "react-redux";
import store from "./store/store";

import Navigation from "./navigation";

export default function Main() {
  return (
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider theme={theme}>
          <Navigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
