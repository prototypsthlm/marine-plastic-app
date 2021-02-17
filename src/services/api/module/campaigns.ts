import { Campaign } from "../../../models";
import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { PagedResponse } from "../types";

const modulePath = "/campaigns";

export const campaignsModule = {
  async getCampaigns(cursor: string | null) {
    const params = {
      cursor,
    };
    const response: HttpResponse<PagedResponse<Campaign>> = await baseApi.get(
      modulePath,
      params
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
