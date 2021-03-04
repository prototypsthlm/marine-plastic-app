import { FeatureType } from "../../../models";

export interface NewFeaturePayload {
  feaureType: FeatureType;

  imageUrl?: string;
  imageGPSLatitude?: number;
  imageGPSLongitude?: number;

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

export interface EditFeaturePayload {
  featureTypeId?: string;

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
