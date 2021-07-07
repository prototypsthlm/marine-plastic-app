import { Measurement, UnitEnum } from "../../models";

export const units: Array<{ value: string; label: string }> = [
  { value: UnitEnum.KG, label: "Kg" },
  { value: UnitEnum.ITEMS_PER_M2, label: "items/m2" },
  { value: UnitEnum.ITEMS_PER_M3, label: "items/m3" },
  { value: UnitEnum.PERCENT_OF_SURFACE, label: "% of surface" },
  { value: UnitEnum.PERCENT_OF_WEIGHT, label: "% of weight" },
  { value: UnitEnum.GRAM_PER_LITER, label: "g/l" },
];

export const getUnitsLabel = (value: string): string =>
  units.find((unit) => unit.value === value)?.label || "";

export const getUnitValueFromMeasurement = (
  measurement: Measurement
): string => {
  if (measurement.quantityKg) return UnitEnum.KG;
  if (measurement.quantityItemsPerM2) return UnitEnum.ITEMS_PER_M2;
  if (measurement.quantityItemsPerM3) return UnitEnum.ITEMS_PER_M3;
  if (measurement.quantityPercentOfSurface) return UnitEnum.PERCENT_OF_SURFACE;
  if (measurement.quantityPercentOfWeight) return UnitEnum.PERCENT_OF_WEIGHT;
  if (measurement.quantityGramPerLiter) return UnitEnum.GRAM_PER_LITER;
  return "";
};

export const getQuantityFromMeasurement = (
  measurement: Measurement
): number | undefined => {
  const unit = getUnitValueFromMeasurement(measurement);
  if (unit == UnitEnum.KG) return measurement.quantityKg;
  if (unit == UnitEnum.ITEMS_PER_M2) return measurement.quantityItemsPerM2;
  if (unit == UnitEnum.ITEMS_PER_M3) return measurement.quantityItemsPerM3;
  if (unit == UnitEnum.PERCENT_OF_SURFACE)
    return measurement.quantityPercentOfSurface;
  if (unit == UnitEnum.PERCENT_OF_WEIGHT)
    return measurement.quantityPercentOfWeight;
  if (unit == UnitEnum.GRAM_PER_LITER) return measurement.quantityGramPerLiter;
  return;
};
