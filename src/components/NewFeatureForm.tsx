import React, { useState } from "react";
import { InputField, KBType } from "./InputField";
import { Button, Switch } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../styled";
import UploadImage from "./UploadImage";
import { RootState, useThunkDispatch } from "../store/store";
import { NewFeaturePayload, addNewFeature } from "../store/slices/features";
import { ListItem, Text, FlexColumn, SectionHeader, FlexRow } from "./elements";
import { theme } from "../theme";
import { NavigationProps } from "../navigation/types";
import { useSelector } from "react-redux";
import { FeatureType } from "../models";

interface InitialFormValuesShape {
  [key: string]: string | boolean | undefined;
  quantity?: string;
  quantityUnits?: string;
  estimatedWeightKg?: string;
  estimatedSizeM2?: string;
  estimatedVolumeM3?: string;
  depthM?: string;

  isAbsence: boolean;
  isCollected: boolean;

  comments?: string;
}

const InitialFormValues: InitialFormValuesShape = {
  quantity: undefined,
  quantityUnits: undefined,
  estimatedWeightKg: undefined,
  estimatedSizeM2: undefined,
  estimatedVolumeM3: undefined,
  depthM: undefined,

  isAbsence: false,
  isCollected: false,

  comments: undefined,
};

const validation = Yup.object().shape({
  quantity: Yup.number()
    .typeError("Input a number")
    .positive("Input a positive number"),
  quantityUnits: Yup.string(),
  estimatedWeightKg: Yup.number()
    .typeError("Input a number")
    .positive("Input a positive number"),
  estimatedSizeM2: Yup.number()
    .typeError("Input a number")
    .positive("Input a positive number"),
  estimatedVolumeM3: Yup.number()
    .typeError("Input a number")
    .positive("Input a positive number"),
  depthM: Yup.number()
    .typeError("Input a number")
    .positive("Input a positive number"),

  isAbsence: Yup.boolean(),
  isCollected: Yup.boolean(),

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

const NewFeatureForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const selectedFeatureTypes = useSelector<RootState, FeatureType | undefined>(
    (state) => state.features.selectedFeatureType
  );

  const [isExtraInfoOpen, setIsExtraInfoOpen] = useState<boolean>(false);

  const [image, setImage] = useState<any>();

  const handleImageChange = (image: object) => {
    setImage(image);
  };

  const handleFormSubmit = (values: any, actions: any) => {
    if (selectedFeatureTypes === undefined) return;
    const imageLocation = getImageLocation(image);
    const newFeature: NewFeaturePayload = {
      feaureType: selectedFeatureTypes,

      imageUrl: image.uri,
      imageGPSLatitude: imageLocation.latitude,
      imageGPSLongitude: imageLocation.longitude,

      quantity: Number(values.quantity),
      quantityUnits: values.quantityUnits,
      estimatedWeightKg: Number(values.estimatedWeightKg),
      estimatedSizeM2: Number(values.estimatedSizeM2),
      estimatedVolumeM3: Number(values.estimatedVolumeM3),
      depthM: Number(values.depthM),

      isAbsence: values.isAbsence,
      isCollected: values.isCollected,

      comments: values.comments,
    };
    dispatch(addNewFeature(newFeature));
    actions.resetForm(InitialFormValues);
  };

  const extraFields: Array<{ field: string; label: string; kbType: KBType }> = [
    {
      field: "estimatedWeightKg",
      label: "Estimated Weight (Kg)",
      kbType: "numeric",
    },
    {
      field: "estimatedSizeM2",
      label: "Estimated Size (m2)",
      kbType: "numeric",
    },
    {
      field: "estimatedVolumeM3",
      label: "Estimated Volume (m3)",
      kbType: "numeric",
    },
    { field: "depthM", label: "Depth (m)", kbType: "numeric" },
    { field: "comments", label: "Comments", kbType: "default" },
  ];

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
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <>
          <SectionHeader>FEATURE TYPE</SectionHeader>
          <ListItem
            onPress={() => navigation.navigate("featureTypePickerScreen")}
          >
            {selectedFeatureTypes === undefined && (
              <Text
                style={{
                  color: theme.color.palette.gray,
                  paddingTop: theme.spacing.small,
                  paddingBottom: theme.spacing.small,
                }}
              >
                Select feature type...
              </Text>
            )}
            {selectedFeatureTypes !== undefined && (
              <FlexColumn style={{ width: "100%" }}>
                <FlexRow>
                  <Text bold>{selectedFeatureTypes.tsgMlCode}</Text>
                  <Text style={{ color: theme.color.palette.gray }}>
                    {selectedFeatureTypes.material}
                  </Text>
                </FlexRow>
                <Text>{selectedFeatureTypes.name}</Text>
              </FlexColumn>
            )}
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
          {!isExtraInfoOpen && (
            <ListItem onPress={() => setIsExtraInfoOpen(true)}>
              <Text
                style={{
                  color: theme.color.palette.gray,
                  paddingTop: theme.spacing.small,
                  paddingBottom: theme.spacing.small,
                }}
              >
                Tap to expand form...
              </Text>
            </ListItem>
          )}
          {isExtraInfoOpen && (
            <>
              <ListItemNonTouchable>
                <Text>Is absent</Text>
                <Switch
                  trackColor={{
                    false: "#767577",
                    true: theme.color.palette.curiousBlue,
                  }}
                  onValueChange={(value) => setFieldValue("isAbsence", value)}
                  value={values.isAbsence}
                />
              </ListItemNonTouchable>
              <ListItemNonTouchable>
                <Text>Is collected</Text>
                <Switch
                  trackColor={{
                    false: "#767577",
                    true: theme.color.palette.curiousBlue,
                  }}
                  onValueChange={(value) => setFieldValue("isCollected", value)}
                  value={values.isCollected}
                />
              </ListItemNonTouchable>
              <FormSection>
                <FlexRow>
                  <InputField
                    halfWidth
                    keyboardType="numeric"
                    label="Quantity"
                    preset="default"
                    onChangeText={handleChange("quantity")}
                    onBlur={handleBlur("quantity")}
                    value={values.quantity}
                    error={
                      touched.quantity && errors.quantity
                        ? errors.quantity
                        : undefined
                    }
                  />
                  <InputField
                    halfWidth
                    label="Quantity units"
                    preset="default"
                    onChangeText={handleChange("quantityUnits")}
                    onBlur={handleBlur("quantityUnits")}
                    value={values.quantityUnits}
                    error={
                      touched.quantityUnits && errors.quantityUnits
                        ? errors.quantityUnits
                        : undefined
                    }
                  />
                </FlexRow>
                {extraFields.map((item, index) => (
                  <InputField
                    key={index}
                    label={item.label}
                    keyboardType={item.kbType}
                    preset="default"
                    onChangeText={handleChange(item.field)}
                    onBlur={handleBlur(item.field)}
                    value={values[item.field] as string}
                    error={
                      touched[item.field] && errors[item.field]
                        ? errors[item.field]
                        : undefined
                    }
                  />
                ))}
              </FormSection>
            </>
          )}
          <Button
            disabled={!image || selectedFeatureTypes === undefined}
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

const ListItemNonTouchable = styled.View`
  background-color: ${(p) => p.theme.color.background};
  border-bottom-color: ${(p) => p.theme.color.palette.gray};
  margin-bottom: 1px;
  padding: ${(props) => props.theme.spacing.small}px
    ${(props) => props.theme.spacing.medium}px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Image = styled.Image`
  align-self: center;
`;

export default NewFeatureForm;
