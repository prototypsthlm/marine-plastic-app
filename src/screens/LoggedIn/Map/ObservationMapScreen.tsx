import * as React from "react";
import styled from "../../../styled";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import { Geometry, Observation } from "../../../models";
import { theme } from "../../../theme";
import { NavigationProps } from "../../../navigation/types";
import { selectObservationDetails } from "../../../store/slices/observations";
import { getLatLng } from '../../../utils/geoUtils';

export default function ObservationMapScreen({ navigation }:NavigationProps) {

  const dispatch = useThunkDispatch();

  const observationsEntries = useSelector<RootState, Array<Observation>>(
    (state) => state.observations.observationEntries
  );

  const handleOnPress = (index: number) => {
    const selectedEntry = observationsEntries[index];

    dispatch(selectObservationDetails(selectedEntry));
    navigation.navigate("observationDetailScreen");
  }

  const isValidGeometry = (geometry: Geometry): boolean => {
    if(!geometry || !geometry.coordinates) return false;
    if(geometry.coordinates.length < 2) return false;
    if(geometry.coordinates[0] === undefined || geometry.coordinates[1] === undefined) return false;
    return true;
  }

  return (
    <Screen>
      <MapView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        {observationsEntries.map((observationEntry, index) => {
          if(isValidGeometry(observationEntry.geometry)) { 

            console.log(observationEntry)

            return <Marker 
              key={index} 
              coordinate={getLatLng(observationEntry.geometry.coordinates)} 
              onPress={() => handleOnPress(index)}
              pinColor={theme.color.palette.cyan} 
              />
          } else return null;
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
