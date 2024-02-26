import React from "react";
import styled from "../styled";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function OfflineModeBanner() {
  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );

  if (isOnline) return null;

  return (
    <Banner>
      <Row>
        <Text>Offline Mode</Text>
        <Ionicons
          size={24}
          style={{ color: "white", marginHorizontal: 6 }}
          name="cloud-offline"
        />
      </Row>
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
