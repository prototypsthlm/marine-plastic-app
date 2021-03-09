import React, { useState } from "react";
import { LatLng } from "react-native-maps";
import styled from "../../styled";
import { getImageLocation } from "../../utils/geoUtils";
import UploadImage from "../UploadImage";

interface PictureSectionProps {
  onImageUriChange?: (imageUri: string) => void;
  onLocationChange?: (location: LatLng) => void;
  onTimestampChange?: (timestamp: string) => void;
}

export default function PictureSection({
  onImageUriChange,
  onLocationChange,
  onTimestampChange,
}: PictureSectionProps) {
  const [image, setImage] = useState<any>();

  const handleImageChange = (image: any) => {
    setImage(image);

    const imageLocation: LatLng = getImageLocation(image);

    onImageUriChange && onImageUriChange(image.uri);
    onLocationChange && onLocationChange(imageLocation);
  };

  return (
    <>
      {image ? (
        <Image
          source={{ uri: image.uri }}
          style={{ width: "100%", height: 200 }}
        />
      ) : null}
      <UploadImage onChange={handleImageChange} />
    </>
  );
}

const Image = styled.Image`
  align-self: center;
`;
