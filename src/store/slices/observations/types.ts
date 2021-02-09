import { FeatureType, Geometry } from "../../../models";

export type NewObservationPayload = {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;
  features: Array<NewFeaturePayload>;
};

export type NewFeaturePayload = {
  feaureType: FeatureType;
  comments?: string;
  imageUrl?: string;
  imageGPSLatitude?: number;
  imageGPSLongitude?: number;
};
