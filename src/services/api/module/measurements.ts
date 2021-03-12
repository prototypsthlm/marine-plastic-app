import { CreatorApps, Measurement, ObservationImage } from "../../../models";
import { EditMeasurementPayload } from "../../../store/slices/measurements";
import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { PagedResponse, SingleResponse } from "../types";

const measurementPath = "/measurement";
const measurementsPath = "/measurements";

const observationImagePath = "/image";

export const measurementsModule = {
  async getMeasurements(observationId: string | null, cursor: string | null) {
    const params = {
      observationId: observationId === null ? "null" : observationId,
      cursor,
    };

    const response: HttpResponse<PagedResponse<Measurement>> = await baseApi.get(
      measurementsPath,
      params
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async postMeasurement(measurement: Measurement) {
    const params = {
      id: measurement.id,
      creatorApp: measurement.creatorApp,
      creatorId: measurement.creatorId,
      observationId: measurement.observationId,
      litterTypeId: measurement.litterTypeId,
      quantity: measurement.quantity,
      quantityUnits: measurement.quantityUnits,
      estimatedWeightKg: measurement.estimatedWeightKg,
      estimatedSizeM2: measurement.estimatedSizeM2,
      estimatedVolumeM3: measurement.estimatedVolumeM3,
      depthM: measurement.depthM,
      isAbsence: measurement.isAbsence,
      isCollected: measurement.isCollected,
      comments: measurement.comments,
    };
    const response: HttpResponse<SingleResponse<Measurement>> = await baseApi.post(
      measurementPath,
      params
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async patchMeasurement(measurement: Measurement, fieldsToUpdate: EditMeasurementPayload) {
    const params = {
      ...fieldsToUpdate,
    };
    const response: HttpResponse<SingleResponse<Measurement>> = await baseApi.patch(
      measurementPath + "/" + measurement.id,
      params
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async deleteMeasurement(measurement: Measurement) {
    const measurementId = measurement.id;
    const response: HttpResponse<SingleResponse<null>> = await baseApi.delete(
      measurementPath + "/" + measurementId
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },

  // ObservationImages
  async postObservationImage(observationImage: ObservationImage) {
    const imageUri = observationImage.url || "";

    const form = new FormData();
    form.append("id", observationImage.id);
    form.append(
      "creatorApp",
      observationImage.creatorApp || CreatorApps.DATA_COLLECTION_APP
    );
    form.append("observationId", observationImage.observationId);

    const fileExt = imageUri.split(".").pop() || "jpg";
    form.append("image", {
      name: observationImage.id + "-observationImage." + fileExt,
      uri: imageUri,
      type: "image/" + fileExt === "jpg" ? "jpeg" : fileExt,
    });

    const response: HttpResponse<
      SingleResponse<ObservationImage>
    > = await baseApi.post(observationImagePath, form, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async deleteFeatureImage(observationImage: ObservationImage) {
    const observationImageId = observationImage.id;
    const response: HttpResponse<SingleResponse<null>> = await baseApi.delete(
      observationImagePath + "/" + observationImageId
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
