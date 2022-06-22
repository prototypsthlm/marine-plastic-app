import React, { useCallback } from "react"
import { Item } from "react-navigation-header-buttons"
import { theme } from "../theme"
import BasicHeaderButtons from "./BasicHeaderButtons"
import * as Linking from "expo-linking"

export default function SettingsHelperButton() {
  
  const onPress = useCallback( async () => {
    Linking.openURL('https://www.oceanscan.org/mobile-app')
  }, []);

  return (<BasicHeaderButtons>
    <Item
      title="Settings"
      iconName="ios-settings-sharp"
      color={theme.color.palette.cyan}
      onPress={onPress}
    />
  </BasicHeaderButtons>)
}
