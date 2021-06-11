import React from "react";
import { Switch, TextInput, View } from "react-native";
import { theme } from "../../../theme";
import { Text } from "../../elements";

interface Props {
  values: any,
  setFieldValue: any
}

export const SingleItem = ({ values, setFieldValue }: Props) =>
  <View style={{
    marginTop: theme.spacing.large,
    padding: theme.spacing.medium,
    backgroundColor: "white",
  }}>
    <View style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }}>
      <Text>Estimated area above surface</Text>
      <TextInput
        style={{
          backgroundColor: theme.color.palette.softGrey,
          padding: 5,
          textAlign: "right",
          width: 50
        }}
        onChangeText={(value) => setFieldValue("area", value)}
        defaultValue={values.area}
      />
      <Text>m2</Text>
    </View>
    <View style={{
      marginTop: theme.spacing.medium,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }}>
      <Text>Controller/experimental target</Text>
      <Switch
        trackColor={{
          false: theme.color.palette.softGrey,
          true: theme.color.palette.curiousBlue,
        }}
        onValueChange={(value) => setFieldValue("isAbsence", value)}
        value={values.isAbsence}
      />
    </View>
  </View>;
