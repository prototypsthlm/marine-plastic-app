import * as React from "react";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../store/slices/ui";

import { Screen } from "../components/Screen";
import NewObservationForm from "../components/NewObservationForm";
import { NavigationProps } from "../navigation/types";

export default function NewObservationScreen({ navigation }: NavigationProps) {
  const dispatch = useDispatch();
  dispatch(setActiveScreen("add"));

  const handleNewObservationFormSubmit = () =>
    navigation.navigate("ObservationList");

  return (
    <Screen
      scroll
      scrollViewProps={{
        contentContainerStyle: { alignItems: "center" },
      }}
    >
      <NewObservationForm onSubmit={handleNewObservationFormSubmit} />
    </Screen>
  );
}
