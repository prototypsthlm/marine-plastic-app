import * as React from "react";
import styled from "../styled";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../store/slices/ui";

import UploadImage from "../components/UploadImage";

export default function TabOneScreen() {
  const dispatch = useDispatch();
  dispatch(setActiveScreen("list"));

  return (
    <Screen>
      {/* <Text>Hello</Text> */}
      <UploadImage path="/screens/TabOneScreen.tsx" />
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;
