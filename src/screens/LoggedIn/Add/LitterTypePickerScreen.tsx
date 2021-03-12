import * as React from "react";
import LitterTypePicker from "../../../components/LitterTypePicker";
import { Screen } from "../../../components/Screen";

export default function LitterTypePickerScreen() {
  return (
    <Screen scroll>
      <LitterTypePicker />
    </Screen>
  );
}
