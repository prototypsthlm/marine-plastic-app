import React from "react";
import Main from "./src/Main";
import * as SplashScreen from "expo-splash-screen";
import AppLoading from "expo-app-loading";

import useCachedResources from "./src/hooks/useCachedResources";
import { useOverTheAirUpdate } from "./src/hooks/useOverTheAirUpdate";

// Ensure Splash isn't automatically hidden
SplashScreen.preventAutoHideAsync().catch(console.warn);

const App = () => {
  const isLoadingComplete = useCachedResources();
  // Check and apply OTA updates
  const isUpdated = useOverTheAirUpdate();

  if (!isLoadingComplete || !isUpdated) {
    return <AppLoading />;
  }

  return <Main />;
};

export default App;
