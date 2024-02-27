import { Formik, FormikProps } from "formik";
import React, { useLayoutEffect, useRef, useState } from "react";
import { RootState, useThunkDispatch } from "../store/store";
import styled from "../styled";
import { theme } from "../theme";
import { SectionHeader } from "./elements";
import * as Yup from "yup";
import InputField, { KBType } from "./InputField";
import { NavigationProps } from "../navigation/types";
import { useSelector } from "react-redux";
import { Observation, ClassVisualInspectionEnum } from "../models";
import BasicHeaderButtons from "./BasicHeaderButtons";
import { Item } from "react-navigation-header-buttons";
import {
  EditObservationPayload,
  submitEditObservation,
} from "../store/slices/observations";
import VisualInspectionForm from "./VisualInspectionForm/VisualInspectionForm";


interface InitialFormValuesShape {
  [key: string]: string | boolean | undefined;
  comments: string;
  isAbsence: boolean;
  class?: string;
  estimatedAreaAboveSurfaceM2?: string;
  estimatedPatchAreaM2?: string;
  estimatedFilamentLengthM?: string;
  depthM?: string;
}

const validation = Yup.object().shape({
  isAbsence: Yup.boolean(),
  comments: Yup.string(),
  class: Yup.string(),
  estimatedAreaAboveSurfaceM2: Yup.string(),
  estimatedPatchAreaM2: Yup.string(),
  estimatedFilamentLengthM: Yup.string(),
  depthM: Yup.string(),
});

const EditObservationForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const formRef = useRef<FormikProps<InitialFormValuesShape>>(null);

  const handleSubmit = () => {
    if (formRef.current) {
      !formRef.current.isSubmitting && formRef.current.handleSubmit();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicHeaderButtons>
          <Item
            title="Save"
            iconName="checkmark"
            onPress={() => handleSubmit()}
          />
        </BasicHeaderButtons>
      ),
    });
  }, [navigation]);

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

  const [visualInspectionType, setVisualInspectionType] = useState<
    string | undefined
  >(observationEntry?.class);

  const InitialFormValues: InitialFormValuesShape = {
    comments: observationEntry?.comments || "",
    isAbsence: observationEntry?.isAbsence || false,
    class: observationEntry?.class || undefined,
    estimatedAreaAboveSurfaceM2: observationEntry?.estimatedAreaAboveSurfaceM2 
      ? `${observationEntry?.estimatedAreaAboveSurfaceM2}`
      : undefined,
    estimatedPatchAreaM2: observationEntry?.estimatedPatchAreaM2 
      ? `${observationEntry?.estimatedPatchAreaM2}`
      : undefined,
    estimatedFilamentLengthM: observationEntry?.estimatedFilamentLengthM 
      ? `${observationEntry?.estimatedFilamentLengthM}`
      : undefined,
    depthM: observationEntry?.depthM 
      ? `${observationEntry?.depthM}`
      : undefined,
  };

  const handleFormSubmit = (values: any, actions: any) => {
    const editedObservationPayload: EditObservationPayload = {
      comments: values.comments,
      class: visualInspectionType,
      estimatedAreaAboveSurfaceM2: visualInspectionType === ClassVisualInspectionEnum.SINGLE_ITEM
        ? values.estimatedAreaAboveSurfaceM2
        : null,
      estimatedPatchAreaM2: visualInspectionType === ClassVisualInspectionEnum.PATCH
        ? values.estimatedPatchAreaM2
        : null,
      estimatedFilamentLengthM: visualInspectionType === ClassVisualInspectionEnum.FILAMENT
      ? values.estimatedFilamentLengthM
      : null,
      depthM: visualInspectionType !== ClassVisualInspectionEnum.NO_LITTER_PRESENT
      ? values.depthM
      : null,
      isAbsence: values.isAbsense,
    };
    dispatch(submitEditObservation(editedObservationPayload));
    actions.setSubmitting(false);
  };

  const infoFields: Array<{ field: string; label: string; kbType: KBType }> = [
    { field: "comments", label: "Comments", kbType: "default" },
  ];

  return (
    <Formik
      innerRef={formRef}
      initialValues={InitialFormValues}
      onSubmit={handleFormSubmit}
      validationSchema={validation}
      >
      {({ handleBlur, handleChange, values, errors, setFieldValue, touched }) => {
        return (
          <>
            <SectionHeader style={{ marginTop: theme.spacing.large }}>
              EDIT VISUAL INSPECTION
            </SectionHeader>
            <VisualInspectionForm
              visualInspectionType={visualInspectionType}
              setVisualInspectionType={setVisualInspectionType}
              values={values}
              setFieldValue={setFieldValue}
            />

            <SectionHeader style={{ marginTop: theme.spacing.large }}>
              EDIT INFO
            </SectionHeader>
            <FormSection>
              {infoFields.map((item, index) => (
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
        );
      }}
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

export default EditObservationForm;
