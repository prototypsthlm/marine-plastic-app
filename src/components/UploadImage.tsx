import React, { useEffect } from "react";
import { Button, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface UploadImageProps {
  onChange?: (image: string) => void;
}

export default function UploadImage({ onChange }: UploadImageProps) {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });

    console.log(result);

    if (!result.cancelled) {
      onChange && onChange(result.uri);
    }
  };

  return <Button title="Upload an image" onPress={pickImage} />;
}
