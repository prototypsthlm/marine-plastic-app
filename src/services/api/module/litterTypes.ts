import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { LitterTypesResponse, MaterialsResponse } from "../types";

const modulePath = "/litterTypes";
const materialPath = "/materials";

export const litterTypesModule = {
  async getAllLitterTypes() {
    try {
      const response: HttpResponse<LitterTypesResponse> = await baseApi.get(
        modulePath
      );
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
  async getAllMaterials() {
    try {
      const response: HttpResponse<MaterialsResponse> = await baseApi.get(
        materialPath
      );
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
};
