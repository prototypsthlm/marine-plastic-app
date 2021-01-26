import React from "react";
import { InputField } from "./InputField";
import { Button } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../styled";
import { addNewObservation } from "../store/slices/observations";
import { spacing } from "../theme/spacing";
import { useDispatch } from "react-redux";
import UploadImage from "./UploadImage";

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
  const dispatch = useDispatch();

  const onSubmit = (values: any) => {
    dispatch(
      addNewObservation({
        observer: values.observer,
        comment: values.comment,
        image: values.image,
      })
    );
  };

  return (
    <Formik
      initialValues={InitialFormValues}
      onSubmit={onSubmit}
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
        <>
          <UploadImage onChange={handleChange("image")} />
          <StyledWrapper>
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
        </>
      )}
    </Formik>
  );
};

const StyledWrapper = styled.View`
  justify-content: center;
  padding-horizontal: ${spacing.large}px;
  width: 100%;
  margin-bottom: ${spacing.xlarge}px;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.small}px;
  color: ${(props) => props.theme.color.palette.gray};
`;

export default NewObservationForm;
