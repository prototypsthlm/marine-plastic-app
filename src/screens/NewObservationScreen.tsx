import * as React from "react";
import styled from "../styled";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../store/slices/ui";

import NewObservationForm from "../components/NewObservationForm";

export default function NewObservationScreen() {
  const dispatch = useDispatch();
  dispatch(setActiveScreen("add"));

  return (
    <Screen>
      <NewObservationForm />
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
