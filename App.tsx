import React from "react";
import Main from "./src/Main";
import * as SplashScreen from "expo-splash-screen";

// Ensure Splash isn't automatically hidden
SplashScreen.preventAutoHideAsync().catch(console.warn);

const App = () => <Main />;

export default App;
