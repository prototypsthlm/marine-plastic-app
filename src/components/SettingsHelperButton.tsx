import React, { useCallback } from "react"
import { Item } from "react-navigation-header-buttons"
import { theme } from "../theme"
import BasicHeaderButtons from "./BasicHeaderButtons"
import * as Linking from "expo-linking"
import { Platform } from "react-native"

export default function SettingsHelperButton() {
  
  const onPress = useCallback( async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://www.oceanscan.org/configuring-your-ios-app')
    } else {
      Linking.openURL('https://www.oceanscan.org/configuring-your-android-app')
    }
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
