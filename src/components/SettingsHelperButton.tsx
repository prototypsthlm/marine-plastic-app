import React, { useCallback } from "react"
import { Item } from "react-navigation-header-buttons"
import { theme } from "../theme"
import BasicHeaderButtons from "./BasicHeaderButtons"
import { logOut } from '../store/slices/session'
import { useThunkDispatch } from "../store/store"
import { Linking } from "expo"

export default function SettingsHelperButton() {
  
  const onPress = useCallback( async () => {
    Linking.openURL('https://www.oceanscan.org/url/to/helper/page/about/settings')
  }, []);

  return (<BasicHeaderButtons>
    <Item
      title="Help"
      iconName="ios-help-buoy-outline"
      color={theme.color.palette.cyan}
      onPress={onPress}
    />
  </BasicHeaderButtons>)
}
