import React from "react";
import { InputField } from "./InputField";
import { Button } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../styled";
import UploadImage from "./UploadImage";
import { useThunkDispatch } from "../store/store";
import {
  Observation,
  submitNewObservation,
} from "../store/slices/observations";

interface InitialFormValuesShape {
  observer: string;
  comment: string;
  image: string;
}

const InitialFormValues: InitialFormValuesShape = {
  observer: "",
  comment: "",
  image: "",
};

const validation = Yup.object().shape({
  observer: Yup.string().required("Observer is required"),
  comment: Yup.string(),
  image: Yup.string(),
});

const NewObservationForm = () => {
  const dispatch = useThunkDispatch();

  const handleSubmit = (values: any, actions: any) => {
    const newObservationEntry: Observation = {
      observer: values.observer,
      comment: values.comment,
      image: values.image,
    };
    dispatch(submitNewObservation(newObservationEntry));
    actions.resetForm(InitialFormValues);
  };

  return (
    <Formik
      initialValues={InitialFormValues}
      onSubmit={handleSubmit}
      validationSchema={validation}
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        isValid,
        dirty,
        values,
        errors,
        touched,
      }) => (
        <StyledWrapper>
          {values.image ? (
            <Image
              source={{ uri: values.image }}
              style={{ width: 200, height: 200 }}
            />
          ) : null}
          <UploadImage onChange={handleChange("image")} />
          <InputField
            label="Observer*"
            preset="default"
            stylePreset="rounded"
            onChangeText={handleChange("observer")}
            onBlur={handleBlur("observer")}
            value={values.observer}
            error={touched.observer ? errors.observer : ""}
          />
          <InputField
            label="Comment"
            preset="default"
            stylePreset="rounded"
            onChangeText={handleChange("comment")}
            onBlur={handleBlur("comment")}
            value={values.comment}
          />
          <Button
            disabled={!(isValid && dirty)}
            title="Submit"
            onPress={handleSubmit as any}
          />
        </StyledWrapper>
      )}
    </Formik>
  );
};

const StyledWrapper = styled.View`
  justify-content: center;
  padding-horizontal: ${(props) => props.theme.spacing.large}px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.xlarge}px;
  margin-top: ${(props) => props.theme.spacing.medium}px;
`;

const Image = styled.Image`
  align-self: center;
`;

export default NewObservationForm;
