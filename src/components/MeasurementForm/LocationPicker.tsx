import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import styled from "../../styled";
import { theme } from "../../theme";
import { FlexRow } from "../elements";
import LongButton from "../elements/LongButton";

export default function LocationPicker({
  initLocation,
  onSubmitLocation,
}: {
  initLocation: LatLng;
  onSubmitLocation: (location: LatLng) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const [location, setLocation] = useState<LatLng>(initLocation);

  const onMapPress = (e: any) => {
    setLocation(e.nativeEvent.coordinate);
  };

  const submitLocation = () => {
    onSubmitLocation(location);
    setModalVisible(false);
  };

  return (
    <ModalContainer>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <BackgroundModalContainer>
          <ModalCard>
            <FlexRow>
              <LongButton
                half
                onPress={() => {
                  setModalVisible(false);
                }}
                text="Cancel"
                icon={
                  <Ionicons
                    size={30}
                    style={{ color: theme.color.palette.curiousBlue }}
                    name="close-sharp"
                  />
                }
              />
              <LongButton
                half
                onPress={submitLocation}
                text="Pick location"
                icon={
                  <Ionicons
                    size={30}
                    style={{ color: theme.color.palette.curiousBlue }}
                    name="checkmark"
                  />
                }
              />
            </FlexRow>
            <MapView
              style={{
                width: "100%",
                height: "100%",
              }}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0921,
              }}
              onPress={(e) => onMapPress(e)}
            >
              <Marker pinColor={theme.color.palette.cyan} coordinate={location} title="Your position"></Marker>
            </MapView>
          </ModalCard>
        </BackgroundModalContainer>
      </Modal>

      <LongButton
        onPress={() => {
          setModalVisible(true);
          setLocation(initLocation);
        }}
        text="Pick location manually"
        icon={
          <Ionicons
            size={30}
            style={{ color: theme.color.palette.curiousBlue }}
            name="location"
          />
        }
      />
    </ModalContainer>
  );
}

const ModalContainer = styled.View`
  flex: 1;
`;

const BackgroundModalContainer = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.color.overlay};
`;

const ModalCard = styled.View`
  background-color: ${(p) => p.theme.color.background};
  margin-top: ${(p) => p.theme.spacing.header + p.theme.spacing.small}px;
  flex: 1;
`;
