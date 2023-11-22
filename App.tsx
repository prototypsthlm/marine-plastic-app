import React, { useEffect } from "react";
import Main from "./src/Main";
import * as SplashScreen from "expo-splash-screen";

import useCachedResources from "./src/hooks/useCachedResources";
import { useOverTheAirUpdate } from "./src/hooks/useOverTheAirUpdate";

// Ensure Splash isn't automatically hidden
SplashScreen.preventAutoHideAsync();

const App = () => {
  const isLoadingComplete = useCachedResources();
  // Check and apply OTA updates
  useOverTheAirUpdate();

  useEffect(() => {
    if (isLoadingComplete) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  if (!isLoadingComplete) {
    return null;
  }

  return <Main />;
};

export default App;
