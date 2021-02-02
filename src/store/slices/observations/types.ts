import { Geometry } from "../../../models";

export type NewObservationPayload = {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;

  // Temporal (should be part of a feature)
  imageUrl?: string;
};
