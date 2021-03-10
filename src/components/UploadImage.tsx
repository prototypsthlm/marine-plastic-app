import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import styled from "../styled";
import { LocationObject } from "expo-location";
import { ListItem, Text } from "./elements";
import { theme } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import LongButton from "./elements/LongButton";

interface UploadImageProps {
  onChange?: (image: object) => void;
}

export default function UploadImage({ onChange }: UploadImageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canUseMediaLibrary, setCanUseMediaLibrary] = useState<boolean>(false);
  const [canUseCamera, setCanUseCamera] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationObject | null>();

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

      const loc = await Location.getLastKnownPositionAsync();
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
      await requestLocation();
      return;
    }
    setIsLoading(true);

    const loc = await Location.getLastKnownPositionAsync();
    setLocation(loc);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (!result.cancelled) {
      if (!result.exif || !result.exif.GPSLongitude)
        Alert.alert(
          "We can't tell where you are!",
          "This image lacks geolocation metadata. Please provide this data manually."
        );

      if (!result.exif || !result.exif.DateTimeOriginal)
        Alert.alert(
          "No timestamp metadata",
          "This image lacks timestamp metadata. The device current time will be used instead."
        );

      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 1000, height: 1000 } }],
        { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
      );

      onChange && onChange({ ...result, uri: manipResult.uri, location });
    }

    setIsLoading(false);
  };

  const takePhoto = async () => {
    if (!canUseCamera) {
      await requestCamera();
      await requestLocation();
      return;
    }
    setIsLoading(true);

    const loc = await Location.getLastKnownPositionAsync();
    setLocation(loc);

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 1000, height: 1000 } }],
        { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
      );

      onChange && onChange({ ...result, uri: manipResult.uri, location });
    }

    setIsLoading(false);
  };

  return (
    <FlexRow>
      <LongButton
        half
        onPress={pickImage}
        text="Upload a picture"
        icon={
          <Ionicons
            size={30}
            style={{ color: theme.color.palette.curiousBlue }}
            name="ios-image"
          />
        }
      />
      <LongButton
        half
        onPress={takePhoto}
        text="Take photo"
        icon={
          <Ionicons
            size={30}
            style={{ color: theme.color.palette.curiousBlue }}
            name="ios-camera"
          />
        }
      />
    </FlexRow>
  );
}

const FlexRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
