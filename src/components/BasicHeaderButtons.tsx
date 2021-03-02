import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButtons, HeaderButton } from "react-navigation-header-buttons";
import { theme } from "../theme";

// define IconComponent, color, sizes and OverflowIcon in one place
const BasicHeaderButton = (props: any) => (
  <HeaderButton
    IconComponent={Ionicons}
    iconSize={30}
    color={theme.color.accent}
    {...props}
  />
);

const BasicHeaderButtons = (props: any) => {
  return <HeaderButtons HeaderButtonComponent={BasicHeaderButton} {...props} />;
};

export default BasicHeaderButtons;
