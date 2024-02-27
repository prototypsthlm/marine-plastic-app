import { Ionicons } from "@expo/vector-icons";
import React from "react";
import styled from "../../styled";
import { theme } from "../../theme";
import { ListItem, Text } from "./index";

export default function DeleteButton({
  onPress,
  style,
}: {
  onPress?: () => void;
  style?: Object;
}) {
  return (
    <RedButton style={style} onPress={onPress}>
      <Ionicons
        size={20}
        style={{
          color: theme.color.palette.white,
          marginRight: 5,
        }}
        name="trash"
      />
      <Text
        style={{
          color: theme.color.palette.white,
          paddingVertical: theme.spacing.small,
          fontSize: theme.fontSize.large,
        }}
      >
        Delete
      </Text>
    </RedButton>
  );
}

const RedButton = styled(ListItem)`
  background-color: ${theme.color.palette.red};
  margin-bottom: ${theme.spacing.medium}px;
  border-radius: ${theme.spacing.small}px;
  max-width: 50%;
  align-self: center;
  justify-content: center;
  `;
