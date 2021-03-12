import { Geometry } from "../../../models";
import { NewMeasurementPayload } from "../measurements";

export interface NewObservationPayload {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;
  measurements: Array<NewMeasurementPayload>;
  isAbsence: boolean;
  imageUrl?: string;
  imageGPSLatitude?: number;
  imageGPSLongitude?: number;
}

export interface EditObservationPayload {
  comments?: string;
}
