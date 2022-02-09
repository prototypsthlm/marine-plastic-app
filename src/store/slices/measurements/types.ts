export interface NewMeasurementPayload {
  quantity?: number;
  unit?: string;
  isApproximate: boolean;
  isCollected: boolean;
  material?: string;
}

export interface EditMeasurementPayload {
  quantityKg?: number;
  quantityItemsPerM2?: number;
  quantityItemsPerM3?: number;
  quantityPercentOfSurface?: number;
  quantityPercentOfWeight?: number;
  quantityGramPerLiter?: number;
  isApproximate: boolean;
  isCollected: boolean;
  material?: string;
}
