import * as React from "react";
import styled from "../styled";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../store/slices/ui";

import UploadImage from "../components/UploadImage";

export default function NewObservationScreen() {
  const dispatch = useDispatch();
  dispatch(setActiveScreen("add"));

  return (
    <Screen>
      <UploadImage path="/screens/NewObservationScreen.tsx" />
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
