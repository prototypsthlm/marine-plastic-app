import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Switch } from "react-native";
import { LatLng } from "react-native-maps";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Campaign, ClassVisualInspectionEnum } from "../models";
import { NavigationProps } from "../navigation/types";
import { NewMeasurementPayload } from "../store/slices/measurements";
import {
  NewObservationPayload,
  submitNewObservation,
} from "../store/slices/observations";
import { RootState, useThunkDispatch } from "../store/store";
import styled from "../styled";
import { theme } from "../theme";
import { getGeometryFromLocation } from "../utils/geoUtils";
import VerticalSegmentedControl from "./controls/VerticalSegmentedControl";
import { ListItem, SectionHeader, Text } from "./elements";
import { InputField } from "./InputField";
import MapItem from "./MeasurementForm/MapItem";
import PictureSection from "./MeasurementForm/PictureSection";
import TimestampPicker from "./MeasurementForm/TimestampPicker";
import {
  VisualInspectionInputField,
  VisualInspectionSwitchField,
} from "./MeasurementForm/VisualInspectionFields";
import { getUnitsLabel } from "./MeasurementForm/utils";

interface InitialFormValuesShape {
  comments?: string;
  estimatedAreaAboveSurfaceM2?: string;
  estimatedPatchAreaM2?: string;
  estimatedFilamentLengthM?: string;
  isControlled: boolean;
  imageUri?: string;
  location?: LatLng;
  timestamp?: Date;
}

const InitialFormValues: InitialFormValuesShape = {
  isControlled: false,
  timestamp: new Date(Date.now()),
};

const numberValidation = () =>
  Yup.number()
    .transform((_, value) => {
      return +value.replace(/,/, ".");
    })
    .typeError("Input a number")
    .positive("Input a positive number");

const validation = Yup.object().shape({
  comments: Yup.string(),
  estimatedAreaAboveSurfaceM2: numberValidation(),
  estimatedPatchAreaM2: numberValidation(),
  estimatedFilamentLengthM: numberValidation(),
  isControlled: Yup.boolean().required(),
  imageUri: Yup.string().required(),
  location: Yup.object({
    latitude: Yup.number().required(),
    longitude: Yup.number().required(),
  }).required(),
});

const NewObservationForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const selectedCampaignEntry = useSelector<RootState, Campaign | undefined>(
    (state) => state.campaigns.selectedCampaignEntry
  );

  const measurementsToAdd = useSelector<
    RootState,
    Array<NewMeasurementPayload>
  >((state) => state.measurements.measurementsToAdd);

  const handleFormSubmit = (values: any, actions: any) => {
    const newObservation: NewObservationPayload = {
      comments: values.comments,
      timestamp: values.timestamp,
      geometry: getGeometryFromLocation(values.location),
      measurements: measurementsToAdd,
      class:
        visualInspectionType == ClassVisualInspectionEnum.NO_LITTER_PRESENT
          ? undefined
          : visualInspectionType,
      estimatedAreaAboveSurfaceM2:
        visualInspectionType == ClassVisualInspectionEnum.SINGLE_ITEM
          ? Number(values.estimatedAreaAboveSurfaceM2?.replace(/,/, "."))
          : undefined,
      estimatedPatchAreaM2:
        visualInspectionType == ClassVisualInspectionEnum.PATCH
          ? Number(values.estimatedPatchAreaM2?.replace(/,/, "."))
          : undefined,
      estimatedFilamentLengthM:
        visualInspectionType == ClassVisualInspectionEnum.FILAMENT
          ? Number(values.estimatedFilamentLengthM?.replace(/,/, "."))
          : undefined,
      isControlled:
        visualInspectionType == ClassVisualInspectionEnum.SINGLE_ITEM &&
        values.isControlled,
      isAbsence:
        visualInspectionType == ClassVisualInspectionEnum.NO_LITTER_PRESENT,
      imageUrl: values.imageUri,
      imageGPSLatitude: values.location.latitude,
      imageGPSLongitude: values.location.longitude,
    };
    dispatch(submitNewObservation(newObservation));
    actions.resetForm(InitialFormValues);
    setVisualInspectionType(undefined);
  };

  const visualInspectionTypes: Array<{
    label: string;
    value: string | undefined;
  }> = [
    {
      label: "No litter present",
      value: ClassVisualInspectionEnum.NO_LITTER_PRESENT,
    },
    {
      label: "Single litter item",
      value: ClassVisualInspectionEnum.SINGLE_ITEM,
    },
    { label: "Small group", value: ClassVisualInspectionEnum.SMALL_GROUP },
    { label: "Patch", value: ClassVisualInspectionEnum.PATCH },
    { label: "Filament", value: ClassVisualInspectionEnum.FILAMENT },
  ];
  const [visualInspectionType, setVisualInspectionType] = useState<
    string | undefined
  >();

  return (
    <Formik
      initialValues={InitialFormValues}
      onSubmit={handleFormSubmit}
      validationSchema={validation}
    >
      {({ handleBlur, handleChange, handleSubmit, setFieldValue, values }) => (
        <>
          <SectionHeader>SELECTED CAMPAIGN</SectionHeader>
          <ListItem onPress={() => navigation.navigate("changeCampaignScreen")}>
            <Text
              style={{
                color: theme.color.palette.gray,
                paddingVertical: theme.spacing.small,
              }}
            >
              {selectedCampaignEntry
                ? selectedCampaignEntry.name
                : "Campaign-less observations"}
            </Text>
          </ListItem>

          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            PICTURE
          </SectionHeader>
          <PictureSection
            imageUri={values.imageUri}
            onImageUriChange={handleChange("imageUri")}
            onLocationChange={(value) => setFieldValue("location", value)}
            onTimestampChange={(value) => setFieldValue("timestamp", value)}
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

          {Boolean(values.imageUri) ? (
            <>
              <SectionHeader style={{ marginTop: theme.spacing.large }}>
                TIMESTAMP
              </SectionHeader>
              <TimestampPicker
                value={values.timestamp}
                onTimestampChange={(value) => setFieldValue("timestamp", value)}
              />
            </>
          ) : null}

          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            VISUAL INSPECTION
          </SectionHeader>
          <VisualInspectionView style={{ marginTop: 0 }}>
            <VerticalSegmentedControl
              style={{ marginTop: theme.spacing.small }}
              items={visualInspectionTypes}
              selectedItem={visualInspectionType}
              onChange={(value) =>
                setVisualInspectionType(
                  value == visualInspectionType ? undefined : value
                )
              }
            />
          </VisualInspectionView>

          <FormSection
            style={{ marginTop: theme.spacing.small, paddingHorizontal: 0 }}
          >
            {visualInspectionType == ClassVisualInspectionEnum.SINGLE_ITEM && (
              <>
                <VisualInspectionInputField
                  label="Estimated area above surface"
                  unit="m2"
                  value={values.estimatedAreaAboveSurfaceM2 as string}
                  onChange={(value) =>
                    setFieldValue("estimatedAreaAboveSurfaceM2", value)
                  }
                />
                <VisualInspectionSwitchField
                  label="Controller/experimental target"
                  value={values.isControlled}
                  onChange={(value) => setFieldValue("isControlled", value)}
                />
              </>
            )}
            {visualInspectionType == ClassVisualInspectionEnum.PATCH && (
              <VisualInspectionInputField
                label="Estimated (patch) area"
                unit="m2"
                value={values.estimatedPatchAreaM2 as string}
                onChange={(value) =>
                  setFieldValue("estimatedPatchAreaM2", value)
                }
              />
            )}
            {visualInspectionType == ClassVisualInspectionEnum.FILAMENT && (
              <VisualInspectionInputField
                label="Estimated (filament) length"
                unit="m"
                value={values.estimatedFilamentLengthM as string}
                onChange={(value) =>
                  setFieldValue("estimatedFilamentLengthM", value)
                }
              />
            )}
          </FormSection>

          <Row>
            <Title>Measurements / Items</Title>
            <ButtonWithIcon
              onPress={() => navigation.navigate("newFeatureScreen")}
            >
              <Ionicons
                size={30}
                style={{ color: theme.color.palette.curiousBlue }}
                name="ios-add-circle"
              />
            </ButtonWithIcon>
          </Row>

          {!(measurementsToAdd.length > 0) && (
            <ListItem>
              <CenteredGrayText>
                You haven't added any measurement.
              </CenteredGrayText>
            </ListItem>
          )}

          {measurementsToAdd.map((measurement, index) => (
            <ListItem key={index}>
              <Text>
                {measurement.quantity} {getUnitsLabel(measurement.unit || "")}
              </Text>
            </ListItem>
          ))}

          <FormSection
            style={{
              marginTop: theme.spacing.xxlarge,
              backgroundColor: theme.color.background,
            }}
          >
            <InputField
              invertColors={false}
              label="Observation Comments"
              preset="default"
              onChangeText={handleChange("comments")}
              onBlur={handleBlur("comments")}
              value={values.comments}
            />
          </FormSection>

          <FormSection style={{ marginBottom: theme.spacing.xxlarge }}>
            <Button
              disabled={
                !values.imageUri || !values.location || !values.timestamp
              }
              title="Save"
              onPress={handleSubmit as any}
            />
          </FormSection>
        </>
      )}
    </Formik>
  );
};

const VisualInspectionView = styled.View`
  margin-top: ${(props) => props.theme.spacing.xlarge}px;
  padding-horizontal: ${(props) => props.theme.spacing.small}px;
`;

const FormSection = styled.View`
  justify-content: center;
  padding-horizontal: ${(props) => props.theme.spacing.medium}px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium}px;
  margin-top: ${(props) => props.theme.spacing.xlarge}px;
`;

const Title = styled.Text`
  margin: ${(props) => props.theme.spacing.medium}px;
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.large}px;
`;

const CenteredGrayText = styled.Text`
  margin: ${(props) => props.theme.spacing.medium}px;
  color: ${(props) => props.theme.color.palette.gray};
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
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

const ButtonWithIcon = styled.TouchableOpacity``;

export default NewObservationForm;
