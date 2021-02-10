import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { GestureResponderEvent, Text } from "react-native";
import styled from "../styled";
import { theme } from "../theme";
import { ListItem } from "./elements";

function OptionItem({
  isSelected,
  option,
  onPress,
}: {
  isSelected: boolean;
  option: string;
  onPress: (event: GestureResponderEvent) => void | undefined;
}) {
  return (
    <ListItem style={{ justifyContent: "space-between" }} onPress={onPress}>
      <Text
        style={{
          color: isSelected ? theme.color.palette.gray : theme.color.text,
          paddingVertical: theme.spacing.small,
          paddingLeft: theme.spacing.medium,
        }}
      >
        {option}
      </Text>
      {isSelected && (
        <Ionicons
          size={30}
          style={{
            color: theme.color.palette.gray,
            marginRight: theme.spacing.medium,
          }}
          name="ios-checkmark"
        />
      )}
    </ListItem>
  );
}

export default function MultiSelectPicker({
  single = false,
  label,
  options,
  onApply,
}: {
  single?: boolean;
  label: string;
  options: Array<string>;
  onApply?: (options: Array<string> | string) => void;
}) {
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  const [selectedSingleItem, setSelectedSingleItem] = useState<string>("");
  const [selectedMultipleItems, setSelectedMultipleItems] = useState<
    Array<string>
  >([]);

  const handlePressItem = (option: string) => {
    if (single)
      setSelectedSingleItem(selectedSingleItem === option ? "" : option);
    else {
      if (selectedMultipleItems.includes(option))
        setSelectedMultipleItems(
          selectedMultipleItems.filter((o) => o !== option)
        );
      else setSelectedMultipleItems([...selectedMultipleItems, option]);
    }
  };

  const isOptionSelected = (option: string) => {
    return single
      ? selectedSingleItem === option
      : selectedMultipleItems.includes(option);
  };

  const handleApplyButton = () => {
    setIsPickerVisible(false);
    onApply && onApply(single ? selectedSingleItem : selectedMultipleItems);
  };

  const isSelected = single
    ? selectedSingleItem !== ""
    : selectedMultipleItems.length > 0;

  const inputLabel = isPickerVisible
    ? `Select ${label}...`
    : !isSelected
    ? label
    : single
    ? selectedSingleItem
    : selectedMultipleItems.join(", ");

  return (
    <>
      <ListItem onPress={() => setIsPickerVisible(!isPickerVisible)}>
        <Text
          style={{
            color: theme.color.palette.gray,
            paddingVertical: theme.spacing.small,
          }}
        >
          {inputLabel}
        </Text>
      </ListItem>
      {isPickerVisible &&
        options.length > 0 &&
        options.map((option, index) => (
          <OptionItem
            key={index}
            onPress={() => handlePressItem(option)}
            option={option}
            isSelected={isOptionSelected(option)}
          />
        ))}
      {isPickerVisible && options.length > 0 && (
        <DropDownButton onPress={handleApplyButton}>
          <Text
            style={{
              color: theme.color.palette.white,
              paddingVertical: theme.spacing.small,
            }}
          >
            Apply
          </Text>
        </DropDownButton>
      )}
    </>
  );
}

const DropDownButton = styled(ListItem)`
  background-color: ${theme.color.palette.curiousBlue};
  margin-bottom: ${theme.spacing.medium}px;
  justify-content: center;
`;
