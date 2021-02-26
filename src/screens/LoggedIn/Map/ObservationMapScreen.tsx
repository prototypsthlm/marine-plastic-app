import * as React from "react";
import styled from "../../../styled";
import MapView, { Geojson } from "react-native-maps";
import { Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Observation } from "../../../models";

export default function ObservationMapScreen() {
  const observationsEntries = useSelector<RootState, Array<Observation>>(
    (state) => state.observations.observationEntries
  );

  return (
    <Screen>
      <MapView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        {observationsEntries.map((observationEntry, index) => (
          <Geojson
            key={index}
            geojson={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: observationEntry.geometry,
                },
              ],
            }}
          />
        ))}
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
