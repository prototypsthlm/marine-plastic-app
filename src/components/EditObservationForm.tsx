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


// DUPLICATED FROM NewObservationForm
import VerticalSegmentedControl from "./controls/VerticalSegmentedControl";
import {
  VisualInspectionInputField,
  VisualInspectionSwitchField,
} from "./MeasurementForm/VisualInspectionFields";


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
            iconName="ios-checkmark"
            onPress={() => handleSubmit()}
          />
        </BasicHeaderButtons>
      ),
    });
  }, [navigation]);

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

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
      estimatedAreaAboveSurfaceM2: values.estimatedAreaAboveSurfaceM2,
      estimatedPatchAreaM2: values.estimatedPatchAreaM2,
      estimatedFilamentLengthM: values.estimatedFilamentLengthM,
      depthM: values.depthM,
      isAbsence: values.isAbesense,
    };
    dispatch(submitEditObservation(editedObservationPayload));
    actions.setSubmitting(false);
  };

  const infoFields: Array<{ field: string; label: string; kbType: KBType }> = [
    { field: "comments", label: "Comments", kbType: "default" },
  ];

  // DUPLICATED FROM NewObservationForm
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
  >(observationEntry?.class);

// TODO maybe refactor duplicates into different file 
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

            <VisualInspectionView style={{ marginTop: 0 }}>
              <VerticalSegmentedControl
                style={{ marginTop: theme.spacing.small }}
                items={visualInspectionTypes}
                selectedItem={visualInspectionType}
                onChange={(value) => {
                  setVisualInspectionType(
                    value == visualInspectionType ? undefined : value
                  )
                }}
              />
            </VisualInspectionView>

            <FormSection
              style={{ marginTop: theme.spacing.small, paddingHorizontal: 0 }}
            >
              {visualInspectionType &&
                visualInspectionType !=
                  ClassVisualInspectionEnum.NO_LITTER_PRESENT ? (
                  <VisualInspectionInputField
                    label="Depth"
                    unit="m"
                    value={values.depthM as string}
                    onChange={(value) => setFieldValue("depthM", value)}
                  />
                ) : null }
              {visualInspectionType == ClassVisualInspectionEnum.SINGLE_ITEM ? (
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
              ) : null }
              {visualInspectionType == ClassVisualInspectionEnum.PATCH ? (
                <VisualInspectionInputField
                  label="Estimated (patch) area"
                  unit="m2"
                  value={values.estimatedPatchAreaM2 as string}
                  onChange={(value) =>
                    setFieldValue("estimatedPatchAreaM2", value)
                  }
                />
              ) : null }
              {visualInspectionType == ClassVisualInspectionEnum.FILAMENT ? (
                <VisualInspectionInputField
                  label="Estimated (filament) length"
                  unit="m"
                  value={values.estimatedFilamentLengthM as string}
                  onChange={(value) =>
                    setFieldValue("estimatedFilamentLengthM", value)
                  }
                />
              ) : null }
            </FormSection>

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

// DUPLICATED FROM NewObservationForm
const VisualInspectionView = styled.View`
  margin-top: ${(props) => props.theme.spacing.xlarge}px;
  padding-horizontal: ${(props) => props.theme.spacing.small}px;
`;

const FormSection = styled.View`
  justify-content: center;
  padding-horizontal: ${(props) => props.theme.spacing.medium}px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium}px;
  padding-top: ${(props) => props.theme.spacing.small}px;
  background-color: ${(props) => props.theme.color.background};
`;

export default EditObservationForm;
