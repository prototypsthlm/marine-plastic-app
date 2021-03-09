import React from "react";
import MapView, { LatLng, Marker } from "react-native-maps";
import LocationPicker from "./LocationPicker";

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
        <Marker pinColor={'turquoise'} coordinate={location} />
      </MapView>
      <LocationPicker
        initLocation={location}
        onSubmitLocation={onLocationChange}
      />
    </>
  );
}
