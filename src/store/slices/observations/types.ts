import { Geometry } from "../../../models";
import { NewFeaturePayload } from "../features";

export interface NewObservationPayload {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;
  features: Array<NewFeaturePayload>;
}
