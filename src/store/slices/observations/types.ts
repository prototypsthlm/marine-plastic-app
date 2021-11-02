import { Geometry, ClassVisualInspection } from "../../../models";
import { NewMeasurementPayload } from "../measurements";

export interface NewObservationPayload {
  comments?: string;
  timestamp: Date;
  geometry: Geometry;
  measurements: Array<NewMeasurementPayload>;
  imageUrl?: string;
  imageGPSLatitude?: number;
  imageGPSLongitude?: number;
  class?: ClassVisualInspection;
  estimatedAreaAboveSurfaceM2?: number;
  estimatedPatchAreaM2?: number;
  estimatedFilamentLengthM?: number;
  depthM?: number;
  isControlled: boolean;
  isAbsence: boolean;
}

export interface EditObservationPayload {
  comments?: string;
  class?: ClassVisualInspection;
  estimatedAreaAboveSurfaceM2?: number;
  estimatedPatchAreaM2?: number;
  estimatedFilamentLengthM?: number;
  depthM?: number;
  isAbsence: boolean;
}
