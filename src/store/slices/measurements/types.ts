import { LitterType } from "../../../models";

export interface NewMeasurementPayload {
  litterType: LitterType;
  quantity?: number;
  quantityUnits?: string;
  estimatedWeightKg?: number;
  estimatedSizeM2?: number;
  estimatedVolumeM3?: number;
  depthM?: number;
  isCollected: boolean;

  comments?: string;
}

export interface EditMeasurementPayload {
  litterTypeId?: string;

  quantity?: number;
  quantityUnits?: string;
  estimatedWeightKg?: number;
  estimatedSizeM2?: number;
  estimatedVolumeM3?: number;
  depthM?: number;

  isAbsence: boolean;
  isCollected: boolean;

  comments?: string;
}
