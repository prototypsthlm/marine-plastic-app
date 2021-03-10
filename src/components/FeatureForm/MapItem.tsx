import React from "react";
import MapView, { LatLng, Marker } from "react-native-maps";
import LocationPicker from "./LocationPicker";
import { theme } from '../../theme';
import { View, Text } from "react-native";

export default function MapItem({
  location,
  onLocationChange,
}: {
  location: LatLng;
  onLocationChange: (location: LatLng) => void;
}) {
  return (
    <>
      <MapView
        style={{
          width: "100%",
          height: 150,
        }}
        zoomEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0921,
        }}
      >
        <View>
          <Marker pinColor={theme.color.palette.cyan} coordinate={location} />
          <Marker coordinate={location}>
            <View style={{ backgroundColor: theme.color.palette.gray, position: 'relative', top: 28}}>
              <Text style={{fontSize: 14, color: theme.color.palette.cyan, fontFamily: theme.typography.primaryBold, padding: 6}}>Suggested position</Text>
            </View>
          </Marker>
        </View>
      </MapView>
      <LocationPicker
        initLocation={location}
        onSubmitLocation={onLocationChange}
      />
    </>
  );
}
