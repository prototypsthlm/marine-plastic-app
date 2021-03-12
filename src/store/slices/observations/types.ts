import { Geometry } from "../../../models";
import { NewMeasurementPayload } from "../measurements";

export interface NewObservationPayload {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;
  measurements: Array<NewMeasurementPayload>;
}

export interface EditObservationPayload {
  comments?: string;
}
