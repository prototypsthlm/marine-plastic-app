import React from "react";
import styled from "../styled";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../store/store";
import { setOfflineModeNotification } from "../store/slices/ui";

export default function OfflineModeBanner() {
  const dispatch = useThunkDispatch();

  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );
  const isOfflineModeNotificationDisabled = useSelector<RootState, boolean>(
    (state) => state.ui.isOfflineModeNotificationDisabled
  );

  if (isOnline || isOfflineModeNotificationDisabled) return null;

  return (
    <Banner>
      <Row>
        <Text>Offline Mode</Text>
        <Ionicons
          size={24}
          style={{ color: "white", marginHorizontal: 6 }}
          name="ios-cloud-offline"
        />
      </Row>
      <CloseButton onPress={() => dispatch(setOfflineModeNotification(true))}>
        <Ionicons
          size={24}
          style={{
            color: "white",
            position: "absolute",
            right: 0,
            marginHorizontal: 6,
          }}
          name="ios-close"
        />
      </CloseButton>
    </Banner>
  );
}

const Banner = styled.View`
  width: 100%;
  padding-horizontal: ${(p) => p.theme.spacing.medium}px;
  padding-vertical: ${(p) => p.theme.spacing.tiny}px;
  background-color: #ff5050;
  align-items: center;

  flex-direction: row;
  justify-content: center;
`;

const Text = styled.Text<{ bold?: boolean }>`
  color: white;
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  align-items: center;
`;

const CloseButton = styled.TouchableWithoutFeedback``;
