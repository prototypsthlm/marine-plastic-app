import React, { useState } from "react";
import { InputField } from "../InputField";
import { Switch } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../../styled";
import { useThunkDispatch } from "../../store/store";

import { NavigationProps } from "../../navigation/types";
import {
  NewMeasurementPayload,
  addNewMeasurement,
} from "../../store/slices/measurements";
import { theme } from "../../theme";
import { Text } from "../elements";
import { units } from "./utils";
import {
  VisualInspectionInputField,
  VisualInspectionDropdownField,
} from "./VisualInspectionFields";

interface InitialFormValuesShape {
  [key: string]: string | boolean | undefined;
  quantity?: string;
  unit?: string;
  isApproximate: boolean;
  isCollected: boolean;
}

const InitialFormValues: InitialFormValuesShape = {
  isApproximate: false,
  isCollected: false,
};

const numberValidation = () =>
  Yup.number()
    .transform((_, value) => {
      return +value.replace(/,/, ".");
    })
    .typeError("Input a number")
    .positive("Input a positive number");

const validation = Yup.object().shape({
  quantity: numberValidation(),
  unit: Yup.string(),
  isApproximate: Yup.boolean(),
  isCollected: Yup.boolean(),
});

const NewMeasurementForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const handleFormSubmit = (values: any, actions: any) => {
    if (!selectedUnit) return;
    const newMeasurement: NewMeasurementPayload = {
      quantity: Number(values.quantity?.replace(/,/, ".")),
      unit: selectedUnit,
      isApproximate: values.isApproximate,
      isCollected: values.isCollected,
    };
    dispatch(addNewMeasurement(newMeasurement));
    actions.resetForm(InitialFormValues);
  };

  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  return (
    <Formik
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
      }) => (
        <>
          <FormSection style={{ paddingHorizontal: 0 }}>
            <VisualInspectionInputField
              label="Value"
              unit=""
              value={values.quantity as string}
              onChange={(value) => setFieldValue("quantity", value)}
            />
            <VisualInspectionDropdownField
              label="Units"
              items={units}
              setValue={setSelectedUnit}
            />
          </FormSection>
          <ListItemNonTouchable>
            <Text>Is Approximate</Text>
            <Switch
              trackColor={{
                false: "#767577",
                true: theme.color.palette.curiousBlue,
              }}
              onValueChange={(value) => setFieldValue("isApproximate", value)}
              value={values.isApproximate}
            />
          </ListItemNonTouchable>
          <ListItemNonTouchable>
            <Text>Is collected</Text>
            <Switch
              trackColor={{
                false: "#767577",
                true: theme.color.palette.curiousBlue,
              }}
              onValueChange={(value) => setFieldValue("isCollected", value)}
              value={values.isCollected}
            />
          </ListItemNonTouchable>

          <SaveButton
            disabled={!selectedUnit}
            title="Save"
            onPress={handleSubmit as any}
          />
        </>
      )}
    </Formik>
  );
};

const SaveButton = styled.Button`
  margin-top: ${(props) => props.theme.spacing.xxlarge}px;
`;

const FormSection = styled.View`
  justify-content: center;
  padding-horizontal: ${(props) => props.theme.spacing.medium}px;
  width: 100%;
  padding-top: ${(props) => props.theme.spacing.small}px;
  background-color: ${(props) => props.theme.color.background};
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

export default NewMeasurementForm;
