import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { LitterTypesResponse } from "../types";

const modulePath = "/litterTypes";

export const litterTypesModule = {
  async getAllLitterTypes() {
    const response: HttpResponse<LitterTypesResponse> = await baseApi.get(
      modulePath
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
