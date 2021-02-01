import React, { useEffect, useState } from "react";
import { Button, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import styled from "../styled";
import { LocationObject } from "expo-location";

interface UploadImageProps {
  onChange?: (image: object) => void;
}

export default function UploadImage({ onChange }: UploadImageProps) {
  const [canUseMediaLibrary, setCanUseMediaLibrary] = useState<boolean>(false);
  const [canUseCamera, setCanUseCamera] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationObject>();

  const requestMediaLibrary = async () => {
    if (Platform.OS !== "web") {
      const {
        status: statusMediaLibrary,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (statusMediaLibrary !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else setCanUseMediaLibrary(true);
    }
  };

  const requestCamera = async () => {
    if (Platform.OS !== "web") {
      const {
        status: statusCamera,
      } = await ImagePicker.requestCameraPermissionsAsync();
      if (statusCamera !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else setCanUseCamera(true);
    }
  };

  const requestLocation = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }
  };

  useEffect(() => {
    (async () => {
      await requestMediaLibrary();
      await requestCamera();
      await requestLocation();
    })();
  }, []);

  const pickImage = async () => {
    if (!canUseMediaLibrary) {
      await requestMediaLibrary();
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });

    if (!result.cancelled) {
      onChange && onChange(result);
    }
  };

  const takePhoto = async () => {
    if (!canUseCamera) {
      await requestCamera();
      await requestLocation();
      return;
    }

    if (!location) {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });

    if (!result.cancelled) {
      onChange && onChange({ ...result, location });
    }
  };

  return (
    <>
      <Button title="Upload an image" onPress={pickImage} />
      <Text>or</Text>
      <Button title="Take photo" onPress={takePhoto} />
    </>
  );
}

const Text = styled.Text`
  text-align: center;
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;
