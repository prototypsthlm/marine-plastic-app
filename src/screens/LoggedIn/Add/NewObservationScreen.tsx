import * as React from "react";
import { Screen } from "../../../components/Screen";
import NewObservationForm from "../../../components/NewObservationForm";
import { NavigationProps } from "../../../navigation/types";

export default function NewObservationScreen({ navigation }: NavigationProps) {
  return (
    <Screen scroll>
      <NewObservationForm navigation={navigation} />
    </Screen>
  );
}
