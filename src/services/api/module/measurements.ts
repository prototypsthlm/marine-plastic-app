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
    console.log(params);

    try {
      const response: HttpResponse<PagedResponse<Measurement>> =
        await baseApi.get(measurementsPath, params);
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
  async postMeasurement(measurement: Measurement) {
    const params = {
      id: measurement.id,
      creatorApp: measurement.creatorApp,
      creatorId: measurement.creatorId,
      observationId: measurement.observationId,
      litterTypeId: measurement.litterTypeId,
      quantityKg: measurement.quantityKg,
      quantityItemsPerM2: measurement.quantityItemsPerM2,
      quantityItemsPerM3: measurement.quantityItemsPerM3,
      quantityPercentOfSurface: measurement.quantityPercentOfSurface,
      quantityPercentOfWeight: measurement.quantityPercentOfWeight,
      quantityGramPerLiter: measurement.quantityGramPerLiter,
      isApproximate: measurement.isApproximate,
      isCollected: measurement.isCollected,
      comments: measurement.comments,
      material: measurement.material,
    };
    try {
      const response: HttpResponse<SingleResponse<Measurement>> =
        await baseApi.post(measurementPath, params);
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
  async patchMeasurement(
    measurement: Measurement,
    fieldsToUpdate: EditMeasurementPayload
  ) {
    const params = {
      ...fieldsToUpdate,
    };
    try {
      const response: HttpResponse<SingleResponse<Measurement>> =
        await baseApi.patch(measurementPath + "/" + measurement.id, params);
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
  async deleteMeasurement(measurement: Measurement) {
    const measurementId = measurement.id;
    try {
      const response: HttpResponse<SingleResponse<null>> = await baseApi.delete(
        measurementPath + "/" + measurementId
      );
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },

  // ObservationImages
  async postObservationImage(observationImage: ObservationImage) {
    const params = {
      id: observationImage.id,
      creatorApp: observationImage.creatorApp || CreatorApps.DATA_COLLECTION_APP,
      observationId: observationImage.observationId,
      image: observationImage.url
    }

    try {
      const response: HttpResponse<SingleResponse<ObservationImage>> =
        await baseApi.post(observationImagePath, params);
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      console.log("image fail", e)
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
  async deleteFeatureImage(observationImage: ObservationImage) {
    const observationImageId = observationImage.id;
    try {
      const response: HttpResponse<SingleResponse<null>> = await baseApi.delete(
        observationImagePath + "/" + observationImageId
      );
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
};
