import * as React from "react";
import styled from "../styled";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../store/slices/ui";

import UploadImage from "../components/UploadImage";

export default function TabTwoScreen() {
  const dispatch = useDispatch();
  dispatch(setActiveScreen("add"));

  return (
    <Screen>
      <UploadImage path="/screens/TabTwoScreen.tsx" />
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
