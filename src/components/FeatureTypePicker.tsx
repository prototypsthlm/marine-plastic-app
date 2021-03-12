import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { EnvCompartmentsEnum, LitterType } from "../models";
import {
  addLitterType,
  selectLitterTypeByMaterial,
} from "../store/slices/measurements";
import { RootState, useThunkDispatch } from "../store/store";
import styled from "../styled";
import { theme } from "../theme";
import { ListItem, SectionHeader, Text, FlexColumn, FlexRow } from "./elements";
import MultiSelectPicker from "./MultiSelectPicker";

export default function LitterTypePicker() {
  const dispatch = useThunkDispatch();

  const litterTypes = useSelector<RootState, Array<LitterType>>(
    (state) => state.measurements.litterTypes
  );

  const optionsMaterial = useSelector(selectLitterTypeByMaterial);
  const optionsEnvCompts = [
    EnvCompartmentsEnum.BEACH,
    EnvCompartmentsEnum.BIOTA,
    EnvCompartmentsEnum.FLOATING,
    EnvCompartmentsEnum.MICRO,
    EnvCompartmentsEnum.SEAFLOOR,
  ];

  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>(
    ""
  );
  const [selectedEnvComptsFilter, setSelectedEnvComptsFilter] = useState<
    Array<string>
  >([]);

  const handleApplyMaterialFilter = (option: any) => {
    setSelectedMaterialFilter(option);
  };
  const handleApplyEnvComptsFilter = (options: any) => {
    setSelectedEnvComptsFilter(options);
  };

  const filterReducer = (litterType: LitterType) => {
    const isMaterialFilterApplied = !(selectedMaterialFilter === "");
    const isEnvComptsFilterApplied = !(selectedEnvComptsFilter.length === 0);
    const isEitherFitersApplied =
      isMaterialFilterApplied || isEnvComptsFilterApplied;
    const areBothFitersApplied =
      isMaterialFilterApplied && isEnvComptsFilterApplied;

    const checkMaterial = litterType.material === selectedMaterialFilter;
    const checkEnvCompts = litterType.environmentalCompartments.some(
      (envCompt) => selectedEnvComptsFilter.includes(envCompt)
    );

    if (!isEitherFitersApplied) return true;

    if (!isEnvComptsFilterApplied && checkMaterial) return true;

    if (!isMaterialFilterApplied && checkEnvCompts) return true;

    if (areBothFitersApplied && checkMaterial && checkEnvCompts) return true;

    return false;
  };

  const filteredFeatureTypes = litterTypes.filter(filterReducer);

  return (
    <>
      <SectionHeader>FILTER BY...</SectionHeader>
      <MultiSelectPicker
        single
        label="Material"
        options={optionsMaterial}
        onApply={handleApplyMaterialFilter}
      />
      <MultiSelectPicker
        label="Env. compartments"
        options={optionsEnvCompts}
        onApply={handleApplyEnvComptsFilter}
      />

      <SectionHeader style={{ marginTop: theme.spacing.large }}>
        SELECT FEATURE TYPE
      </SectionHeader>

      {!(filteredFeatureTypes.length > 0) && (
        <ListItem style={{ justifyContent: "center" }}>
          <CenteredGrayText>
            There aren't any items matching this criteria.
          </CenteredGrayText>
        </ListItem>
      )}

      {filteredFeatureTypes.map((litterType, index) => (
        <ListItem
          key={index}
          onPress={() => dispatch(addLitterType(litterType))}
        >
          <FlexColumn style={{ width: "100%" }}>
            <FlexRow>
              <Text bold>{litterType.tsgMlCode}</Text>
              <Text style={{ color: theme.color.palette.gray }}>
                {litterType.material}
              </Text>
            </FlexRow>
            <Text>{litterType.name}</Text>
          </FlexColumn>
        </ListItem>
      ))}
    </>
  );
}

const CenteredGrayText = styled.Text`
  margin: ${(props) => props.theme.spacing.medium}px;
  color: ${(props) => props.theme.color.palette.gray};
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;
