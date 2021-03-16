import * as React from "react";
import { Screen } from "../../../components/Screen";
import EditFeatureForm from "../../../components/EditMeasurementForm";
import { NavigationProps } from "../../../navigation/types";

export default function MeasurementEditScreen({ navigation }: NavigationProps) {
  return (
    <Screen scroll>
      <EditFeatureForm navigation={navigation} />
    </Screen>
  );
}
