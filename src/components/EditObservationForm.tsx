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
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InitialFormValuesShape {
  [key: string]: string | undefined;
  comments: string;
}

const validation = Yup.object().shape({
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
        <TouchableOpacity onPress={() => handleSubmit()}>
          <Ionicons
            size={30}
            style={{ color: "#2f95dc", marginHorizontal: 16 }}
            name="ios-checkmark"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

  const InitialFormValues: InitialFormValuesShape = {
    comments: observationEntry?.comments || "",
  };

  const handleFormSubmit = (values: any, actions: any) => {
    console.log(values);
    // dispatch(addNewFeature(newFeature));
    // actions.resetForm(InitialFormValues);
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
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => {
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
