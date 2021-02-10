import { FeatureType, Geometry } from "../../../models";

export interface NewObservationPayload {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;
  features: Array<NewFeaturePayload>;
}

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
