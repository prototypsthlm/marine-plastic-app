import React, { FC } from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import styled from "../styled";

interface ScreenProps {
  scroll?: boolean;
  style?: Record<string, any>;
  scrollViewProps?: ScrollViewProps;
}

export const Screen: FC<ScreenProps> = ({
  scroll = false,
  children,
  scrollViewProps,
  ...rest
}) => (
  <ScreenView {...rest}>
    {scroll ? (
      <ScrollView {...scrollViewProps}>{children}</ScrollView>
    ) : (
      children
    )}
  </ScreenView>
);

const ScreenView = styled.View`
  flex: 1;
`;
