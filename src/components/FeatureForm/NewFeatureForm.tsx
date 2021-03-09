import React, { useEffect, useState } from "react";
import { InputField, KBType } from "../InputField";
import { Button, Switch } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../../styled";
import { RootState, useThunkDispatch } from "../../store/store";

import { useSelector } from "react-redux";
import { FeatureType } from "../../models";
import MapItem from "./MapItem";
import PictureSection from "./PictureSection";
import { LatLng } from "react-native-maps";
import { NavigationProps } from "../../navigation/types";
import {
  selectFeatureType,
  resetFeatureType,
  NewFeaturePayload,
  addNewFeature,
} from "../../store/slices/features";
import { theme } from "../../theme";
import {
  SectionHeader,
  ListItem,
  FlexColumn,
  FlexRow,
  Text,
} from "../elements";

interface InitialFormValuesShape {
  [key: string]: string | boolean | LatLng | undefined;
  quantity?: string;
  quantityUnits?: string;
  estimatedWeightKg?: string;
  estimatedSizeM2?: string;
  estimatedVolumeM3?: string;
  depthM?: string;

  isAbsence: boolean;
  isCollected: boolean;

  comments?: string;

  imageUri?: string;
  location?: LatLng;
}

const InitialFormValues: InitialFormValuesShape = {
  isAbsence: false,
  isCollected: false,
};

const numberValidation = () =>
  Yup.number()
    .transform((_, value) => {
      return +value.replace(/,/, ".");
    })
    .typeError("Input a number")
    .positive("Input a positive number");

const validation = Yup.object().shape({
  quantity: numberValidation(),
  quantityUnits: Yup.string(),
  estimatedWeightKg: numberValidation(),
  estimatedSizeM2: numberValidation(),
  estimatedVolumeM3: numberValidation(),
  depthM: numberValidation(),

  isAbsence: Yup.boolean(),
  isCollected: Yup.boolean(),

  comments: Yup.string(),

  imageUri: Yup.string().required(),
  location: Yup.object({
    latitude: Yup.number().required(),
    longitude: Yup.number().required(),
  }).required(),
});

const NewFeatureForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const defaultFeatureType = useSelector<RootState, FeatureType | undefined>(
    (state) => state.features.featureTypes.find((x) => x.tsgMlCode === "G999")
  );

  const selectedFeatureTypes = useSelector<RootState, FeatureType | undefined>(
    (state) => state.features.selectedFeatureType
  );

  useEffect(() => {
    defaultFeatureType
      ? dispatch(selectFeatureType(defaultFeatureType))
      : dispatch(resetFeatureType());
  }, []);

  const [isExtraInfoOpen, setIsExtraInfoOpen] = useState<boolean>(false);

  const handleFormSubmit = (values: any, actions: any) => {
    if (selectedFeatureTypes === undefined) return;
    const newFeature: NewFeaturePayload = {
      feaureType: selectedFeatureTypes,

      imageUrl: values.imageUri,
      imageGPSLatitude: values.location.latitude,
      imageGPSLongitude: values.location.longitude,

      quantity: Number(values.quantity?.replace(/,/, ".")),
      quantityUnits: values.quantityUnits,
      estimatedWeightKg: Number(values.estimatedWeightKg?.replace(/,/, ".")),
      estimatedSizeM2: Number(values.estimatedSizeM2?.replace(/,/, ".")),
      estimatedVolumeM3: Number(values.estimatedVolumeM3?.replace(/,/, ".")),
      depthM: Number(values.depthM?.replace(/,/, ".")),

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
      kbType: "decimal-pad",
    },
    {
      field: "estimatedSizeM2",
      label: "Estimated Size (m2)",
      kbType: "decimal-pad",
    },
    {
      field: "estimatedVolumeM3",
      label: "Estimated Volume (m3)",
      kbType: "decimal-pad",
    },
    { field: "depthM", label: "Depth (m)", kbType: "decimal-pad" },
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
          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            PICTURE
          </SectionHeader>
          <PictureSection
            onImageUriChange={handleChange("imageUri")}
            onLocationChange={(value) => setFieldValue("location", value)}
          />

          {Boolean(values.imageUri) && values.location !== undefined ? (
            <>
              <SectionHeader style={{ marginTop: theme.spacing.large }}>
                GEOLOCATION
              </SectionHeader>
              <MapItem
                location={values.location}
                onLocationChange={(value) => setFieldValue("location", value)}
              />
            </>
          ) : null}

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
              <ListItem
                onPress={() => navigation.navigate("featureTypePickerScreen")}
              >
                {selectedFeatureTypes === undefined && (
                  <Text
                    style={{
                      color: theme.color.palette.curiousBlue,
                      paddingTop: theme.spacing.small,
                      paddingBottom: theme.spacing.small,
                    }}
                  >
                    Select feature type...
                  </Text>
                )}
                {selectedFeatureTypes !== undefined && (
                  <FlexColumn
                    style={{
                      width: "100%",
                      paddingTop: theme.spacing.small,
                      paddingBottom: theme.spacing.small,
                    }}
                  >
                    <FlexRow>
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: theme.spacing.small,
                        }}
                      >
                        TYPE
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.color.palette.curiousBlue,
                        }}
                      >
                        Change
                      </Text>
                    </FlexRow>
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
            disabled={
              Boolean(touched.imageUri && errors.imageUri) ||
              selectedFeatureTypes === undefined
            }
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

export default NewFeatureForm;
