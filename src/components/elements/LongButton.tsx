import React from "react";
import { theme } from "../../theme";
import { ListItem, Text } from "./index";

export default function LongButton({
  half = false,
  text,
  icon,
  onPress,
}: {
  half?: boolean;
  text: string;
  icon?: any;
  onPress?: () => void;
}) {
  return (
    <ListItem
      style={{
        width: half ? "50%" : "100%",
        borderRightColor: theme.color.palette.gray,
        marginRight: 1,
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <Text style={{ color: theme.color.palette.curiousBlue, paddingRight: 8 }}>
        {text}
      </Text>
      {icon}
    </ListItem>
  );
}
