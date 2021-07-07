import React from "react";
import { Switch, TextInput, View } from "react-native";
import { theme } from "../../theme";
import { Text } from "../elements";
import RNPickerSelect from "react-native-picker-select";

interface InputFieldProps {
  style?: object;
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
}

export const VisualInspectionInputField = ({
  style,
  label,
  unit,
  value,
  onChange,
}: InputFieldProps) => (
  <View
    style={{
      padding: theme.spacing.medium,
      backgroundColor: theme.color.palette.white,
      ...style,
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Text>{label}</Text>
      <TextInput
        style={{
          backgroundColor: theme.color.palette.softGrey,
          padding: 5,
          textAlign: "right",
          width: 50,
          marginLeft: "auto",
          marginRight: unit ? 10 : 0,
        }}
        onChangeText={onChange}
        defaultValue={value}
      />
      {Boolean(unit) && <Text>{unit}</Text>}
    </View>
  </View>
);

interface SwitchFieldProps {
  style?: object;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const VisualInspectionSwitchField = ({
  style,
  label,
  value,
  onChange,
}: SwitchFieldProps) => (
  <View
    style={{
      padding: theme.spacing.medium,
      backgroundColor: theme.color.palette.white,
      ...style,
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Text>{label}</Text>
      <Switch
        trackColor={{
          false: theme.color.palette.softGrey,
          true: theme.color.palette.curiousBlue,
        }}
        onValueChange={onChange}
        value={value}
      />
    </View>
  </View>
);

interface DropdownFieldProps {
  style?: object;
  label: string;
  value?: string;
  items: Array<{ label: string; value: string }>;
  setValue: (value: any) => void;
}

export const VisualInspectionDropdownField = ({
  style,
  label,
  value,
  items,
  setValue,
}: DropdownFieldProps) => (
  <View
    style={{
      padding: theme.spacing.medium,
      backgroundColor: theme.color.palette.white,
      ...style,
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Text>{label}</Text>
      <RNPickerSelect
        onValueChange={(value: { label: string; value: string }) =>
          setValue(value)
        }
        items={items}
        value={value}
        placeholder={{ label: "Select a unit...", value: null }}
      />
    </View>
  </View>
);
