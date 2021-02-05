import * as React from "react";
import { Screen } from "../../components/Screen";
import NewFeatureForm from "../../components/NewFeatureForm";

export default function NewFeatureScreen() {
  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      <NewFeatureForm />
    </Screen>
  );
}
