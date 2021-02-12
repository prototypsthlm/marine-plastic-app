import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";

import campaigns from "../../../assets/mockdata/campaigns.json";

const modulePath = "/campaigns";

export const campaignsModule = {
  async mockGETCampaigns(cursor: string | null) {
    return campaigns;
  },
};
