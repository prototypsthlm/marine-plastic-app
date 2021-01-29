import * as React from "react";
import { Screen } from "../components/Screen";
import NewObservationForm from "../components/NewObservationForm";

export default function NewObservationScreen() {
  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      <NewObservationForm />
    </Screen>
  );
}
