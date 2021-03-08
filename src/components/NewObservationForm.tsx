import React, { useEffect } from "react";
import { InputField } from "./InputField";
import { Button, Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../styled";
import { RootState, useThunkDispatch } from "../store/store";
import {
  NewObservationPayload,
  submitNewObservation,
} from "../store/slices/observations";
import { NewFeaturePayload } from "../store/slices/features";
import { Campaign, Geometry } from "../models";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "../navigation/types";
import { ListItem, SectionHeader, Text } from "./elements";
import { theme } from "../theme";
import { getGeometryFromFeatures } from "../utils/geoUtils";

interface InitialFormValuesShape {
  comments: string;
}

const InitialFormValues: InitialFormValuesShape = {
  comments: "",
};

const validation = Yup.object().shape({
  comments: Yup.string(),
});

const NewObservationForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const selectedCampaignEntry = useSelector<RootState, Campaign | undefined>(
    (state) => state.campaigns.selectedCampaignEntry
  );

  const featuresToAdd = useSelector<RootState, Array<NewFeaturePayload>>(
    (state) => state.features.featuresToAdd
  );

  useEffect(() => {
    // If there are no features added to the obs., 
    // go to new feature screen directly
    if(featuresToAdd.length===0) 
      navigation.navigate("newFeatureScreen")
  }, [featuresToAdd])

  const handleFormSubmit = (values: any, actions: any) => {
    const newObservation: NewObservationPayload = {
      comments: values.comments,
      timestamp: new Date(Date.now()), // TODO: Timestamp from exif
      geometry: getGeometryFromFeatures(featuresToAdd),
      features: featuresToAdd,
    };
    dispatch(submitNewObservation(newObservation));
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

          <FormSection>
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

          <Row>
            <Title>Features / Items</Title>
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

          {!(featuresToAdd.length > 0) && (
            <ListItem>
              <CenteredGrayText>
                You haven't added any feature.
              </CenteredGrayText>
            </ListItem>
          )}

          {featuresToAdd.map((feature, index) => (
            <ListItem key={index}>
              {Boolean(feature.imageUrl) && (
                <Image
                  source={{ uri: feature.imageUrl }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 6,
                    marginRight: 12,
                  }}
                ></Image>
              )}
              <Text>{feature.feaureType.name}</Text>
            </ListItem>
          ))}

          <FormSection>
            <Button
              disabled={featuresToAdd.length < 1}
              title="Submit"
              onPress={handleSubmit as any}
            />
          </FormSection>
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

const ButtonWithIcon = styled.TouchableOpacity``;

export default NewObservationForm;
