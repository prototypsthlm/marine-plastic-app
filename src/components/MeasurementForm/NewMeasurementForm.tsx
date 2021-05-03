import React from "react";
import { InputField, KBType } from "../InputField";
import { Button, Switch } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styled from "../../styled";
import { useThunkDispatch } from "../../store/store";

import { LatLng } from "react-native-maps";
import { NavigationProps } from "../../navigation/types";
import {
  NewMeasurementPayload,
  addNewMeasurement,
} from "../../store/slices/measurements";
import { theme } from "../../theme";
import { FlexRow, Text } from "../elements";

interface InitialFormValuesShape {
  [key: string]: string | boolean | LatLng | undefined;
  quantity?: string;
  quantityUnits?: string;
  estimatedWeightKg?: string;
  estimatedSizeM2?: string;
  estimatedVolumeM3?: string;
  depthM?: string;
  isCollected: boolean;

  comments?: string;
}

const InitialFormValues: InitialFormValuesShape = {
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
  quantityUnits: Yup.string(),
  estimatedWeightKg: numberValidation(),
  estimatedSizeM2: numberValidation(),
  estimatedVolumeM3: numberValidation(),
  depthM: numberValidation(),
  isCollected: Yup.boolean(),

  comments: Yup.string(),
});

const NewMeasurementForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const handleFormSubmit = (values: any, actions: any) => {
    const newMeasurement: NewMeasurementPayload = {
      quantity: Number(values.quantity?.replace(/,/, ".")),
      quantityUnits: values.quantityUnits,
      estimatedWeightKg: Number(values.estimatedWeightKg?.replace(/,/, ".")),
      estimatedSizeM2: Number(values.estimatedSizeM2?.replace(/,/, ".")),
      estimatedVolumeM3: Number(values.estimatedVolumeM3?.replace(/,/, ".")),
      depthM: Number(values.depthM?.replace(/,/, ".")),
      isCollected: values.isCollected,
      comments: values.comments,
    };
    dispatch(addNewMeasurement(newMeasurement));
    actions.resetForm(InitialFormValues);
  };

  const extraFields: Array<{ field: string; label: string; kbType: KBType }> = [
    {
      field: "estimatedWeightKg",
      label: "Estimated Weight (Kg)",
      kbType: "decimal-pad",
    },
    {
      field: "estimatedSizeM2",
      label: "Estimated Size (m2)",
      kbType: "decimal-pad",
    },
    {
      field: "estimatedVolumeM3",
      label: "Estimated Volume (m3)",
      kbType: "decimal-pad",
    },
    { field: "depthM", label: "Depth (m)", kbType: "decimal-pad" },
    { field: "comments", label: "Comments", kbType: "default" },
  ];

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
          <FormSection>
            <FlexRow>
              <InputField
                halfWidth
                keyboardType="numeric"
                label="Quantity"
                preset="default"
                onChangeText={handleChange("quantity")}
                onBlur={handleBlur("quantity")}
                value={values.quantity}
                error={
                  touched.quantity && errors.quantity
                    ? errors.quantity
                    : undefined
                }
              />
              <InputField
                halfWidth
                label="Quantity units"
                preset="default"
                onChangeText={handleChange("quantityUnits")}
                onBlur={handleBlur("quantityUnits")}
                value={values.quantityUnits}
                error={
                  touched.quantityUnits && errors.quantityUnits
                    ? errors.quantityUnits
                    : undefined
                }
              />
            </FlexRow>
            {extraFields.map((item, index) => (
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
          <Button
            disabled={Boolean(touched.imageUri && errors.imageUri)}
            title="Add measurement to observation"
            onPress={handleSubmit as any}
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
