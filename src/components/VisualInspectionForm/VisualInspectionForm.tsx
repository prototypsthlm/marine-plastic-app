import React from "react"
import VerticalSegmentedControl from "../controls/VerticalSegmentedControl";
import {
  VisualInspectionInputField,
  VisualInspectionSwitchField,
} from "../MeasurementForm/VisualInspectionFields";
import { ClassVisualInspectionEnum } from "../../models";
import styled from "../../styled";
import { theme } from "../../theme";

export const visualInspectionTypes: Array<{
  label: string;
  value: string | undefined;
}> = [
  {
    label: "No litter or debris visible",
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

interface visualInspectionFormProps {
  visualInspectionType: string | undefined;
  setVisualInspectionType: (type: string | undefined) => void;
  values: any;
  setFieldValue: (field: string, value: any) => void;
}

const VisualInspectionForm = ({
  visualInspectionType,
   setVisualInspectionType,
   values,
   setFieldValue
  } : visualInspectionFormProps) => {

  return (
    <>
      <VisualInspectionView style={{ marginTop: 0 }}>
      <VerticalSegmentedControl
        style={{ marginTop: theme.spacing.small }}
        items={visualInspectionTypes}
        selectedItem={visualInspectionType}
        onChange={(value) => setVisualInspectionType(
            value === visualInspectionType ? undefined : value
          )}
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
      {visualInspectionType === ClassVisualInspectionEnum.SINGLE_ITEM ? (
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
      {visualInspectionType === ClassVisualInspectionEnum.PATCH ? (
        <VisualInspectionInputField
          label="Estimated (patch) area"
          unit="m2"
          value={values.estimatedPatchAreaM2 as string}
          onChange={(value) =>
            setFieldValue("estimatedPatchAreaM2", value)
          }
        />
      ) : null }
      {visualInspectionType === ClassVisualInspectionEnum.FILAMENT ? (
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
  </>
  );
}

const FormSection = styled.View`
  justify-content: center;
  padding-horizontal: ${(props) => props.theme.spacing.medium}px;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.medium}px;
  padding-top: ${(props) => props.theme.spacing.small}px;
  background-color: ${(props) => props.theme.color.background};
`;

const VisualInspectionView = styled.View`
  margin-top: ${(props) => props.theme.spacing.xlarge}px;
  padding-horizontal: ${(props) => props.theme.spacing.small}px;
`;

export default VisualInspectionForm;
