import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface UploadImageProps {
  onChange?: (image: string) => void;
}

export default function UploadImage({ onChange }: UploadImageProps) {
  const [image, setImage] = useState<string>("");

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
      setImage(result.uri);
      onChange && onChange(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {image ? (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      ) : null}
      <Button title="Upload an image" onPress={pickImage} />
    </View>
  );
}
