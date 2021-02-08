import React, { useState } from "react";
import { InputField } from "./InputField";
import { Button } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../styled";
import UploadImage from "./UploadImage";
import { useThunkDispatch } from "../store/store";
import { NewFeaturePayload, addNewFeature } from "../store/slices/observations";
import { ListItem, Text, FlexColumn, SectionHeader } from "./elements";
import { theme } from "../theme";

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
      {({ handleBlur, handleChange, handleSubmit, values }) => (
        <>
          <SectionHeader>FEATURE TYPE</SectionHeader>
          <ListItem>
            <Text
              style={{
                color: theme.color.palette.gray,
                paddingTop: theme.spacing.small,
                paddingBottom: theme.spacing.small,
              }}
            >
              Select feature type...
            </Text>
          </ListItem>

          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            PICTURE
          </SectionHeader>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={{ width: "100%", height: 200 }}
            />
          ) : null}
          <UploadImage onChange={handleImageChange} />
          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            EXTRA INFO
          </SectionHeader>
          <FormSection>
            <InputField
              invertColors={false}
              label="Comments"
              preset="default"
              onChangeText={handleChange("comments")}
              onBlur={handleBlur("comments")}
              value={values.comments}
            />
          </FormSection>
          <Button
            disabled={!image}
            title="Add feature to observation"
            onPress={handleSubmit as any}
          />
        </>
      )}
    </Formik>
  );
};

const FormSection = styled.View`
  justify-content: center;
  padding-horizontal: ${(props) => props.theme.spacing.medium}px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium}px;
  padding-top: ${(props) => props.theme.spacing.small}px;
  background-color: ${(props) => props.theme.color.background};
`;

const Image = styled.Image`
  align-self: center;
`;

export default NewFeatureForm;
