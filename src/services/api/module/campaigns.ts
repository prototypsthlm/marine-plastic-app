import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { CampaignsResponse } from "../types";

const modulePath = "/campaigns";

export const campaignsModule = {
  async getCampaigns(cursor: string | null) {
    const params = {
      cursor,
    };
    const response: HttpResponse<CampaignsResponse> = await baseApi.get(
      modulePath,
      params
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
