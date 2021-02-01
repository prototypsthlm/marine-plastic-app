import * as React from "react";
import styled from "../styled";
import MapView, { Marker } from "react-native-maps";
import { Dimensions, Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Observation } from "../store/slices/observations";

export default function ObservationMapScreen() {
  const observationsEntries = useSelector<RootState, Array<Observation>>(
    (state) => state.observations.entries
  );

  return (
    <Screen>
      <MapView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        {observationsEntries
          .filter((o) => o.location && o.location.latitude)
          .map((observationEntry, index) => {
            if (
              !observationEntry.location ||
              !observationEntry.location.latitude
            )
              return;
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: observationEntry.location.latitude,
                  longitude: observationEntry.location.longitude,
                }}
                title={`Observer: ${observationEntry.observer}`}
                description={
                  observationEntry.timestamp
                    ? new Date(observationEntry.timestamp)
                        .toUTCString()
                        .slice(5, 17)
                    : ""
                }
              >
                <MarkerPopup>
                  {observationEntry.image ? (
                    <Image
                      source={{ uri: observationEntry.image }}
                      style={{ width: 50, height: 50, borderRadius: 6 }}
                    />
                  ) : null}
                </MarkerPopup>
              </Marker>
            );
          })}
      </MapView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const MarkerPopup = styled.View`
  border-radius: 6px;
  background-color: white;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;
