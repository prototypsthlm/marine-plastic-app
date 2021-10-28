import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { InputField, KBType } from "../InputField";
import { Switch } from "react-native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import styled from "../../styled";
import { RootState, useThunkDispatch } from "../../store/store";
import {
  submitEditMeasurement,
  selectLitterType,
  EditMeasurementPayload,
} from "../../store/slices/measurements";

import {
  ListItem,
  Text,
  FlexColumn,
  SectionHeader,
  FlexRow,
} from "../elements";
import { theme } from "../../theme";
import { NavigationProps } from "../../navigation/types";
import { useSelector } from "react-redux";
import { Measurement, LitterType, UnitEnum } from "../../models";
import BasicHeaderButtons from "../BasicHeaderButtons";
import { Item } from "react-navigation-header-buttons";
import {
  units,
  getUnitValueFromMeasurement,
  getQuantityFromMeasurement,
} from "./utils";
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

const NewFeatureForm = ({ navigation }: NavigationProps) => {
  const dispatch = useThunkDispatch();

  const measurementEntry = useSelector<RootState, Measurement | undefined>(
    (state) => state.measurements.selectedMeasurementEntry
  );

  const InitialFormValues: InitialFormValuesShape = {
    quantity:
      measurementEntry &&
      String(getQuantityFromMeasurement(measurementEntry) || ""),
    unit: measurementEntry && getUnitValueFromMeasurement(measurementEntry),
    isCollected: measurementEntry?.isCollected || false,
    isApproximate: measurementEntry?.isApproximate || false,
  };

  const selectedLitterTypes = useSelector<RootState, LitterType | undefined>(
    (state) => state.measurements.selectedLitterType
  );

  const litterTypes = useSelector<RootState, Array<LitterType>>(
    (state) => state.measurements.litterTypes
  );

  const currentLitterType: LitterType | undefined = litterTypes.find(
    (ft) => ft.id === measurementEntry?.litterTypeId
  );

  useEffect(() => {
    if (currentLitterType) dispatch(selectLitterType(currentLitterType));
  }, []);

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

  const handleFormSubmit = (values: any, actions: any) => {
    if (!selectedUnit) return;
    const editedFeature: EditMeasurementPayload = {
      quantityKg:
        selectedUnit == UnitEnum.KG
          ? Number(values.quantity?.replace(/,/, "."))
          : undefined,
      quantityItemsPerM2:
        selectedUnit == UnitEnum.ITEMS_PER_M2
          ? Number(values.quantity?.replace(/,/, "."))
          : undefined,
      quantityItemsPerM3:
        selectedUnit == UnitEnum.ITEMS_PER_M3
          ? Number(values.quantity?.replace(/,/, "."))
          : undefined,
      quantityPercentOfSurface:
        selectedUnit == UnitEnum.PERCENT_OF_SURFACE
          ? Number(values.quantity?.replace(/,/, "."))
          : undefined,
      quantityPercentOfWeight:
        selectedUnit == UnitEnum.PERCENT_OF_WEIGHT
          ? Number(values.quantity?.replace(/,/, "."))
          : undefined,
      quantityGramPerLiter:
        selectedUnit == UnitEnum.GRAM_PER_LITER
          ? Number(values.quantity?.replace(/,/, "."))
          : undefined,
      isApproximate: values.isApproximate,
      isCollected: values.isCollected,
    };
    dispatch(submitEditMeasurement(editedFeature));
    actions.setSubmitting(false);
  };

  const [selectedUnit, setSelectedUnit] = useState<string | null>(
    (measurementEntry && getUnitValueFromMeasurement(measurementEntry)) || null
  );

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
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <>
          <SectionHeader style={{ marginTop: theme.spacing.large }}>
            EXTRA INFO
          </SectionHeader>
          {/* <ListItem
            onPress={() => navigation.navigate("featureTypePickerScreen")}
          >
            {selectedLitterTypes === undefined && (
              <Text
                style={{
                  color: theme.color.palette.curiousBlue,
                  paddingTop: theme.spacing.small,
                  paddingBottom: theme.spacing.small,
                }}
              >
                Select feature type...
              </Text>
            )}
            {selectedLitterTypes !== undefined && (
              <FlexColumn style={{ 
                  width: "100%", 
                  paddingTop: theme.spacing.small,
                  paddingBottom: theme.spacing.small
                }}>
                <FlexRow>
                  <Text style={{
                    fontSize: 12, 
                    marginBottom: theme.spacing.small 
                  }}>
                    TYPE
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: theme.color.palette.curiousBlue,
                  }}>
                    Change
                  </Text>
                </FlexRow>
                <FlexRow>
                  <Text bold>{selectedLitterTypes.tsgMlCode}</Text>
                  <Text style={{ color: theme.color.palette.gray }}>
                    {selectedLitterTypes.material}
                  </Text>
                </FlexRow>
                <Text>{selectedLitterTypes.name}</Text>
              </FlexColumn>
            )}
          </ListItem> */}
          <FormSection style={{ paddingHorizontal: 0 }}>
            <VisualInspectionInputField
              label="Value"
              unit=""
              value={values.quantity as string}
              onChange={(value) => setFieldValue("quantity", value)}
            />
            <VisualInspectionDropdownField
              label="Units"
              value={selectedUnit || ""}
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

const Image = styled.Image`
  align-self: center;
`;

export default NewFeatureForm;
