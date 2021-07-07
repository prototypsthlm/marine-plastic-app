import React, { FC } from "react";
import { ScrollView, ScrollViewProps, Platform } from "react-native";
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
  <ScreenView {...rest} behavior={Platform.OS == "ios" ? "padding" : "height"}>
    {offlineBanner && <OfflineModeBanner />}
    {scroll ? (
      <ScrollView {...scrollViewProps}>{children}</ScrollView>
    ) : (
      children
    )}
  </ScreenView>
);

const ScreenView = styled.KeyboardAvoidingView`
  flex: 1;
`;
