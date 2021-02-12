import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { FeatureTypesResponse } from "../types";

const modulePath = "/featureTypes";

export const featureTypesModule = {
  async getAllFeatureTypes() {
    const response: HttpResponse<FeatureTypesResponse> = await baseApi.get(
      modulePath
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
