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
    try {
      const response: HttpResponse<PagedResponse<Campaign>> = await baseApi.get(
        modulePath,
        params
      );
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
};
