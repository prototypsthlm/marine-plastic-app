import React, { useState } from "react";
import { InputField } from "./InputField";
import { Button } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../styled";
import UploadImage from "./UploadImage";
import { useThunkDispatch } from "../store/store";
import { NewFeaturePayload, addNewFeature } from "../store/slices/observations";

interface InitialFormValuesShape {
  comments: string;
}

const InitialFormValues: InitialFormValuesShape = {
  comments: "",
};

const validation = Yup.object().shape({
  comments: Yup.string(),
});

function formatGPSLocation(dd: number, ref: string) {
  if (ref == "S" || ref == "W") {
    dd = dd * -1;
  }
  return dd;
}

function getImageLocation(image: any) {
  if (!image.exif?.GPSLongitude && image.location)
    return {
      longitude: image.location.coords.longitude,
      latitude: image.location.coords.latitude,
    };
  else
    return {
      longitude:
        image.exif &&
        formatGPSLocation(image.exif.GPSLongitude, image.exif.GPSLongitudeRef),
      latitude:
        image.exif &&
        formatGPSLocation(image.exif.GPSLatitude, image.exif.GPSLatitudeRef),
    };
}

const NewFeatureForm = () => {
  const dispatch = useThunkDispatch();

  const [image, setImage] = useState<any>();

  const handleImageChange = (image: object) => {
    setImage(image);
  };

  const handleFormSubmit = (values: any, actions: any) => {
    const imageLocation = getImageLocation(image);
    const newFeature: NewFeaturePayload = {
      comments: values.comments,
      imageUrl: image.uri,
      imageGPSLatitude: imageLocation.latitude,
      imageGPSLongitude: imageLocation.longitude,
    };
    dispatch(addNewFeature(newFeature));
    actions.resetForm(InitialFormValues);
  };

  return (
    <Formik
      initialValues={InitialFormValues}
      onSubmit={handleFormSubmit}
      validationSchema={validation}
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        isValid,
        dirty,
        values,
        errors,
        touched,
      }) => (
        <StyledWrapper>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={{ width: 200, height: 200 }}
            />
          ) : null}
          <UploadImage onChange={handleImageChange} />
          <InputField
            label="Comments"
            preset="default"
            stylePreset="rounded"
            onChangeText={handleChange("comments")}
            onBlur={handleBlur("comments")}
            value={values.comments}
          />
          <Button
            disabled={!image}
            title="Add feature to observation"
            onPress={handleSubmit as any}
          />
        </StyledWrapper>
      )}
    </Formik>
  );
};

const StyledWrapper = styled.View`
  justify-content: center;
  padding-horizontal: ${(props) => props.theme.spacing.large}px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.xlarge}px;
  margin-top: ${(props) => props.theme.spacing.medium}px;
`;

const Image = styled.Image`
  align-self: center;
`;

export default NewFeatureForm;
