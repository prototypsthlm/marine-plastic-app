import React, { useEffect, useState } from "react";
import { LatLng } from "react-native-maps";
import styled from "../../styled";
import { getImageLocation } from "../../utils/geoUtils";
import { getImageTimestamp } from "../../utils/timeUtils";
import UploadImage from "../UploadImage";

interface PictureSectionProps {
  imageUri?: string | undefined;
  onImageUriChange?: (imageUri: string) => void;
  onLocationChange?: (location: LatLng) => void;
  onTimestampChange?: (timestamp: Date | undefined) => void;
}

export default function PictureSection({
  imageUri,
  onImageUriChange,
  onLocationChange,
  onTimestampChange,
}: PictureSectionProps) {
  const [image, setImage] = useState<any>();

  useEffect(() => {
    if(!imageUri) {
      resetState();
    }
  }, [imageUri]);

  const resetState = () => {
    setImage(null);
  }

  const handleImageChange = (image: any) => {
    setImage(image);

    const imageLocation: LatLng = getImageLocation(image);
    const imageTimestamp: Date | undefined = getImageTimestamp(image);

    onImageUriChange && onImageUriChange(image.uri);
    onLocationChange && onLocationChange(imageLocation);
    onTimestampChange && imageTimestamp && onTimestampChange(imageTimestamp)
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
