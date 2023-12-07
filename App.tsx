import React, { useEffect } from "react";
import Main from "./src/Main";
import * as SplashScreen from "expo-splash-screen";

import useCachedResources from "./src/hooks/useCachedResources";

// Ensure Splash isn't automatically hidden
SplashScreen.preventAutoHideAsync();

const App = () => {
  const isLoadingComplete = useCachedResources();

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
