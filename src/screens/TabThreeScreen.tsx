import * as React from "react";
import styled from "../styled";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../store/slices/ui";

import UploadImage from "../components/UploadImage";

export default function TabThreeScreen() {
  const dispatch = useDispatch();
  dispatch(setActiveScreen("map"));

  return (
    <Screen>
      <UploadImage path="/screens/TabThreeScreen.tsx" />
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
