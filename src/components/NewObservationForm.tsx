import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Switch } from "react-native";
import { LatLng } from "react-native-maps";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Campaign } from "../models";
import { NavigationProps } from "../navigation/types";
import { NewMeasurementPayload } from "../store/slices/measurements";
import { NewObservationPayload, submitNewObservation, } from "../store/slices/observations";
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
import { SingleItem } from "./MeasurementForm/inspection-types/SingleItem";

interface InitialFormValuesShape {
  comments: string;
  isAbsence: boolean;
  imageUri?: string;
  location?: LatLng;
  timestamp?: Date;
}

const InitialFormValues: InitialFormValuesShape = {
  isAbsence: false,
  comments: "",
  imageUri: undefined,
  location: undefined,
  timestamp: new Date(Date.now()),
};

const validation = Yup.object().shape({
  comments: Yup.string(),
  isAbsence: Yup.boolean().required(),
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

  const measurementsToAdd = useSelector<RootState,
    Array<NewMeasurementPayload>>((state) => state.measurements.measurementsToAdd);

  const handleFormSubmit = (values: any, actions: any) => {
    const newObservation: NewObservationPayload = {
      comments: values.comments,
      timestamp: values.timestamp,
      geometry: getGeometryFromLocation(values.location),
      measurements: measurementsToAdd,
      isAbsence: values.isAbsence,
      imageUrl: values.imageUri,
      imageGPSLatitude: values.location.latitude,
      imageGPSLongitude: values.location.longitude,
    };
    dispatch(submitNewObservation(newObservation));
    actions.resetForm(InitialFormValues);
  };

  const visualInspectionTypes = ["No litter present", "Single litter item", "Small group", "Patch", "Filament"];
  const [visualInspectionType, setVisualInspectionTypeIndex] = useState<number>();

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

          <VisualInspectionView>
            <SectionHeader style={{ marginTop: 0, marginRight: 0, marginLeft: 0, marginBottom: 0 }}>
              VISUAL INSPECTION
            </SectionHeader>

            <VerticalSegmentedControl
              style={{ marginTop: theme.spacing.small }}
              items={visualInspectionTypes}
              selectedItemIndex={visualInspectionType}
              onChange={setVisualInspectionTypeIndex}
            />
          </VisualInspectionView>

          <SingleItem values={values} setFieldValue={setFieldValue} />

          <FormSection style={{ marginTop: theme.spacing.xxlarge }}>
            <InputField
              invertColors={false}
              label="Observation Comment"
              preset="default"
              stylePreset="rounded"
              onChangeText={handleChange("comments")}
              onBlur={handleBlur("comments")}
              value={values.comments}
            />
          </FormSection>

          <ListItemNonTouchable>
            <Text>No litter present in observation?</Text>
            <Switch
              trackColor={{
                false: "#767577",
                true: theme.color.palette.curiousBlue,
              }}
              onValueChange={(value) => setFieldValue("isAbsence", value)}
              value={values.isAbsence}
            />
          </ListItemNonTouchable>

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
                Measurement #{index + 1} {measurement.comments}
              </Text>
            </ListItem>
          ))}

          <FormSection>
            <Button
              disabled={
                !values.imageUri || !values.location || !values.timestamp
              }
              title="Submit"
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
  paddingHorizontal: ${(props) => props.theme.spacing.small}px;
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
