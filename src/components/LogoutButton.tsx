import React, { useCallback } from "react"
import { Item } from "react-navigation-header-buttons"
import { theme } from "../theme"
import BasicHeaderButtons from "./BasicHeaderButtons"
import { logOut } from '../store/slices/session'
import { useThunkDispatch } from "../store/store"
import { authSignOut } from '../services/firebaseAuth';

export default function LogoutButton() {

  const dispatch = useThunkDispatch();
  
  const onPress = useCallback( async () => {
    
    try {
      authSignOut(); 
    } catch(e) {
      console.log(e);
    }
  
    // In case request to firebase fails, always dispatch logout
    dispatch(logOut());
  
  }, []);

  return (<BasicHeaderButtons>
    <Item
      title="Logout"
      iconName="log-out-outline"
      color={theme.color.palette.cyan}
      onPress={onPress}
    />
  </BasicHeaderButtons>)
}
