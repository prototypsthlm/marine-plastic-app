import React, { useState } from "react";
import { InputField } from "./InputField";
import { Button } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../styled";
import UploadImage from "./UploadImage";
import { useThunkDispatch } from "../store/store";
import {
  GPSLocation,
  Observation,
  submitNewObservation,
} from "../store/slices/observations";

interface InitialFormValuesShape {
  observer: string;
  comment: string;
}

const InitialFormValues: InitialFormValuesShape = {
  observer: "",
  comment: "",
};

const validation = Yup.object().shape({
  observer: Yup.string().required("Observer is required"),
  comment: Yup.string(),
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

const NewObservationForm = () => {
  const dispatch = useThunkDispatch();

  const [image, setImage] = useState<any>();

  const handleImageChange = (image: object) => {
    setImage(image);
  };

  const handleSubmit = (values: any, actions: any) => {
    const imageLocation: GPSLocation = getImageLocation(image);
    const newObservationEntry: Observation = {
      observer: values.observer,
      comment: values.comment,
      image: image?.uri,
      timestamp: Date.now(),
      location: imageLocation,
    };
    dispatch(submitNewObservation(newObservationEntry));
    actions.resetForm(InitialFormValues);
  };

  return (
    <Formik
      initialValues={InitialFormValues}
      onSubmit={handleSubmit}
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
            label="Observer*"
            preset="default"
            stylePreset="rounded"
            onChangeText={handleChange("observer")}
            onBlur={handleBlur("observer")}
            value={values.observer}
            error={touched.observer ? errors.observer : ""}
          />
          <InputField
            label="Comment"
            preset="default"
            stylePreset="rounded"
            onChangeText={handleChange("comment")}
            onBlur={handleBlur("comment")}
            value={values.comment}
          />
          <Button
            disabled={!(isValid && dirty)}
            title="Submit"
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

export default NewObservationForm;
