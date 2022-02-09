import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { LitterTypesResponse, MaterialsResponse } from "../types";

const modulePath = "/litterTypes";
const materialPath = "/materials";

export const litterTypesModule = {
  async getAllLitterTypes() {
    const response: HttpResponse<LitterTypesResponse> = await baseApi.get(
      modulePath
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
  async getAllMaterials() {
    const response: HttpResponse<MaterialsResponse> = await baseApi.get(
      materialPath
    );
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
