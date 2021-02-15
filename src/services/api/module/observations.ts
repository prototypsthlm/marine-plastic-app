import { Observation } from "../../../models";
import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { PagedResponse } from "../types";

const modulePath = "/observations";

export const observationsModule = {
  async getObservations(campaignId: string | null, cursor: string | null) {
    const params = {
      campaignId: campaignId === null ? "null" : campaignId,
      cursor,
    };
    const response: HttpResponse<
      PagedResponse<Observation>
    > = await baseApi.get(modulePath, params);
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
