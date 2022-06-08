import { Observation } from "../../../models";
import { EditObservationPayload } from "../../../store/slices/observations";
import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { PagedResponse, SingleResponse } from "../types";

const observationPath = "/observation";
const observationsPath = "/observations";

export const observationsModule = {
  async getObservations(campaignId: string | null, cursor: string | null) {
    const params = {
      campaignId: campaignId === null ? "null" : campaignId,
      cursor,
    };
    const response: HttpResponse<PagedResponse<Observation>> =
      await baseApi.get(observationsPath, params);
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async postObservation(observation: Observation) {
    const params = {
      id: observation.id,
      creatorApp: observation.creatorApp,
      creatorId: observation.creatorId,
      campaignId: observation.campaignId,
      geometry: observation.geometry,
      timestamp: observation.timestamp,
      class: observation.class,
      estimatedAreaAboveSurfaceM2: observation.estimatedAreaAboveSurfaceM2,
      estimatedPatchAreaM2: observation.estimatedPatchAreaM2,
      estimatedFilamentLengthM: observation.estimatedFilamentLengthM,
      depthM: observation.depthM,
      comments: observation.comments,
      isControlled: observation.isControlled,
      isAbsence: observation.isAbsence,
    };
    try {
      const response: HttpResponse<SingleResponse<Observation>> =
        await baseApi.post(observationPath, params);
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
  async patchObservation(
    observation: Observation,
    fieldsToUpdate: EditObservationPayload
  ) {
    const params = {
      ...fieldsToUpdate,
    };
    const response: HttpResponse<SingleResponse<Observation>> =
      await baseApi.patch(observationPath + "/" + observation.id, params);
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async deleteObservation(observation: Observation) {
    const observationId = observation.id;
    try {
      const response: HttpResponse<SingleResponse<null>> = await baseApi.delete(
        observationPath + "/" + observationId
      );
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
};
