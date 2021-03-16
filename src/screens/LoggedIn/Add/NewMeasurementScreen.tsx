import * as React from "react";
import { Screen } from "../../../components/Screen";
import NewMeasurementForm from "../../../components/MeasurementForm/NewMeasurementForm";
import { NavigationProps } from "../../../navigation/types";

export default function NewMeasurementScreen({ navigation }: NavigationProps) {
  return (
    <Screen scroll>
      <NewMeasurementForm navigation={navigation} />
    </Screen>
  );
}
