import * as React from "react";
import { Screen } from "../../components/Screen";
import NewFeatureForm from "../../components/NewFeatureForm";
import { NavigationProps } from "../../navigation/types";

export default function NewFeatureScreen({ navigation }: NavigationProps) {
  return (
    <Screen scroll>
      <NewFeatureForm navigation={navigation} />
    </Screen>
  );
}
