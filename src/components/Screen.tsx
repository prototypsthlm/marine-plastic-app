import React, { FC } from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import styled from "../styled";
import OfflineModeBanner from "./OfflineModeBanner";

interface ScreenProps {
  scroll?: boolean;
  offlineBanner?: boolean;
  style?: Record<string, any>;
  scrollViewProps?: ScrollViewProps;
}

export const Screen: FC<ScreenProps> = ({
  scroll = false,
  offlineBanner = true,
  children,
  scrollViewProps,
  ...rest
}) => (
  <ScreenView {...rest}>
    {offlineBanner && <OfflineModeBanner />}
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
