import { CreatorApps, Measurement, FeatureImage } from "../../../models";
import { EditMeasurementPayload } from "../../../store/slices/measurements";
import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { PagedResponse, SingleResponse } from "../types";

const measurementPath = "/measurement";
const measurementsPath = "/measurements";

const featureImagePath = "/featureImage";

export const measurementsModule = {
  async getMeasurements(observationId: string | null, cursor: string | null) {
    const params = {
      observationId: observationId === null ? "null" : observationId,
      cursor,
    };

    console.log("!!!!!!!!!PARAMS!!!!!!!!!!");
    console.log(params);

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

  // FeatureImages
  async postFeatureImage(featureImage: FeatureImage) {
    const imageUri = featureImage.url || "";

    const form = new FormData();
    form.append("id", featureImage.id);
    form.append(
      "creatorApp",
      featureImage.creatorApp || CreatorApps.DATA_COLLECTION_APP
    );
    form.append("featureId", featureImage.featureId);

    const fileExt = imageUri.split(".").pop() || "jpg";
    form.append("image", {
      name: featureImage.id + "-featureImage." + fileExt,
      uri: imageUri,
      type: "image/" + fileExt === "jpg" ? "jpeg" : fileExt,
    });

    const response: HttpResponse<
      SingleResponse<FeatureImage>
    > = await baseApi.post(featureImagePath, form, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async deleteFeatureImage(featureImage: FeatureImage) {
    const featureImageId = featureImage.id;
    const response: HttpResponse<SingleResponse<null>> = await baseApi.delete(
      featureImagePath + "/" + featureImageId
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
