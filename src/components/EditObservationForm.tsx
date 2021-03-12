import { Formik, FormikProps } from "formik";
import React, { useLayoutEffect, useRef } from "react";
import { RootState, useThunkDispatch } from "../store/store";
import styled from "../styled";
import { theme } from "../theme";
import { SectionHeader } from "./elements";
import * as Yup from "yup";
import InputField, { KBType } from "./InputField";
import { NavigationProps } from "../navigation/types";
import { useSelector } from "react-redux";
import { Observation } from "../models";
import BasicHeaderButtons from "./BasicHeaderButtons";
import { Item } from "react-navigation-header-buttons";
import {
  EditObservationPayload,
  submitEditObservation,
} from "../store/slices/observations";

interface InitialFormValuesShape {
  [key: string]: string | boolean | undefined;
  comments: string;
  isAbsence: boolean;
}

const validation = Yup.object().shape({
  isAbsence: Yup.boolean(),
  comments: Yup.string(),
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
  };

  const handleFormSubmit = (values: any, actions: any) => {
    const editedObservationPayload: EditObservationPayload = {
      ...values,
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
      {({ handleBlur, handleChange, values, errors, touched }) => {
        return (
          <>
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
