import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import { Button, KeyboardAvoidingView, Platform } from "react-native";
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
import { ListItem, SectionHeader, Text } from "./elements";
import { InputField } from "./InputField";
import MapItem from "./MeasurementForm/MapItem";
import PictureSection from "./MeasurementForm/PictureSection";
import TimestampPicker from "./MeasurementForm/TimestampPicker";
import { getUnitsLabel } from "./MeasurementForm/utils";
import { string } from "yup";
import VisualInspectionForm from "./VisualInspectionForm/VisualInspectionForm";

import { ModalComponent, HelperButton } from "./HelperPopup";

interface InitialFormValuesShape {
  comments?: string;
  estimatedAreaAboveSurfaceM2?: string;
  estimatedPatchAreaM2?: string;
  estimatedFilamentLengthM?: string;
  depthM?: string;
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
  depthM: numberValidation(),
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
      depthM:
        visualInspectionType &&
        visualInspectionType != ClassVisualInspectionEnum.NO_LITTER_PRESENT
          ? Number(values.depthM?.replace(/,/, "."))
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

  const [visualInspectionType, setVisualInspectionType] = useState<
    string | undefined
  >();

  const [campaignHelperVisible, setCampaignHelperVisible] = useState(false);
  const [pictureHelperVisible, setPictureHelperVisible] = useState(false);
  const [locationHelperVisible, setLocationHelperVisible] = useState(false);
  const [inspectionHelperVisible, setInspectionHelperVisible] = useState(false);
  const [measurementHelperVisible, setMeasurementHelperVisible] =
    useState(false);

  return (
    <Formik
      initialValues={InitialFormValues}
      onSubmit={handleFormSubmit}
      validationSchema={validation}
    >
      {({ handleBlur, handleChange, handleSubmit, setFieldValue, values }) => (
        <>
          <SectionHeader>
            SELECTED CAMPAIGN
            <HelperButton onPress={() => setCampaignHelperVisible(true)} />
          </SectionHeader>

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
            <Ionicons
              size={20}
              style={{
                color: theme.color.palette.curiousBlue,
                marginLeft: "auto",
                marginRight: 5,
              }}
              name="chevron-down"
            />
          </ListItem>

          <SectionHeader style={{ marginTop: theme.spacing.medium }}>
            PICTURE
            <HelperButton onPress={() => setPictureHelperVisible(true)} />
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
                <HelperButton onPress={() => setLocationHelperVisible(true)} />
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
            <HelperButton onPress={() => setInspectionHelperVisible(true)} />
          </SectionHeader>
          <VisualInspectionForm
            visualInspectionType={visualInspectionType}
            setVisualInspectionType={setVisualInspectionType}
            values={values}
            setFieldValue={setFieldValue}
          />

          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            QUANTITY AND TYPE
            <HelperButton onPress={() => setMeasurementHelperVisible(true)} />
          </SectionHeader>

          {!(measurementsToAdd.length > 0) && (
            <ListItem>
              <CenteredGrayText>
                You haven't added any measurement.
              </CenteredGrayText>
            </ListItem>
          )}

          {measurementsToAdd.map((measurement, index) => (
            <ListItem key={index}>
              <Text style={{ flexGrow: 1 }}>
                {measurement.quantity} {getUnitsLabel(measurement.unit || "")}
              </Text>
              <Text bold style={{ flexGrow: 0 }}>
                {measurement.material ? measurement.material : "Unspecified"}
              </Text>
            </ListItem>
          ))}

          <ButtonWithIcon
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 5 }}
            onPress={() => navigation.navigate("newFeatureScreen")}
          >
            <Ionicons
              size={30}
              style={{ color: theme.color.palette.curiousBlue }}
              name="ios-add-circle"
            />
          </ButtonWithIcon>

          <FormSection
            style={{
              marginTop: theme.spacing.xxlarge,
              backgroundColor: theme.color.background,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <InputField
                label="Observation Comments"
                preset="default"
                onChangeText={handleChange("comments")}
                onBlur={handleBlur("comments")}
                value={values.comments}
                placeholder={
                  "Please here any additional information to your observation here."
                }
                placeholderTextColor={theme.color.palette.gray}
              />
            </KeyboardAvoidingView>
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

          <ModalComponent
            visibilityState={campaignHelperVisible}
            setVisibilityFunction={setCampaignHelperVisible}
            popupTitle={"What is a Campaign?"}
            popupText={
              "Group of observations that will be associated with the same group ID. Each campaign, will be associated with a DOI."
            }
          />
          <ModalComponent
            visibilityState={pictureHelperVisible}
            setVisibilityFunction={setPictureHelperVisible}
            popupTitle={"Why is a picture needed?"}
            popupText={
              "We use pictures to understand if what we observe from satellites is matching what is actually visible on the ground."
            }
          />
          <ModalComponent
            visibilityState={locationHelperVisible}
            setVisibilityFunction={setLocationHelperVisible}
            popupTitle={"Why should I add a location and time?"}
            popupText={
              "Trash in the oceans is moving, so in order to match your picture with our satellite images we need to know when and where you took the photo."
            }
          />
          <ModalComponent
            visibilityState={inspectionHelperVisible}
            setVisibilityFunction={setInspectionHelperVisible}
            popupTitle={"Visual inspection"}
            popupText={
              "Please add information about shape and size of what you observe (e.g. is it a single item, a large patch or a filament? How big is it?)"
            }
          />
          <ModalComponent
            visibilityState={measurementHelperVisible}
            setVisibilityFunction={setMeasurementHelperVisible}
            popupTitle={"Quantity and type"}
            popupText={
              "Please add information about the quantity and litter type that you observe (is it mostly plastic or is it mixed material? What is the % of plastic?). You can add several measurements."
            }
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
