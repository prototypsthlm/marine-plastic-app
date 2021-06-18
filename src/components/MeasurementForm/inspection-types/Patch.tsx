import React from "react";
import { Switch, TextInput, View } from "react-native";
import { theme } from "../../../theme";
import { Text } from "../../elements";

interface Props {
  style?: object,
  values: any,
  setFieldValue: any
}

export const Patch = ({ style, values, setFieldValue }: Props) =>
  <View style={{
    marginTop: theme.spacing.large,
    padding: theme.spacing.medium,
    backgroundColor: "white",
    ...style
  }}>
    <View style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }}>
      <Text>Estimated (patch) area</Text>
      <TextInput
        style={{
          backgroundColor: theme.color.palette.softGrey,
          padding: 5,
          textAlign: "right",
          width: 50,
          marginLeft: "auto",
          marginRight: 10
        }}
        onChangeText={(value) => setFieldValue("area", value)}
        defaultValue={values.area}
      />
      <Text>m2</Text>
    </View>
  </View>;
