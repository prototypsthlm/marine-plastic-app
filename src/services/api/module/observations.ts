import { Observation } from "../../../models";
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
    const response: HttpResponse<
      PagedResponse<Observation>
    > = await baseApi.get(observationsPath, params);
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
      comments: observation.comments,
    };
    const response: HttpResponse<
      SingleResponse<Observation>
    > = await baseApi.post(observationPath, params);
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
