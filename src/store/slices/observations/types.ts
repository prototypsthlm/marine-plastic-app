import { Geometry } from "../../../models";

export type NewObservationPayload = {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;
  features: Array<NewFeaturePayload>;
};

export type NewFeaturePayload = {
  comments?: string;
  imageUrl?: string;
  imageGPSLatitude?: number;
  imageGPSLongitude?: number;
};
