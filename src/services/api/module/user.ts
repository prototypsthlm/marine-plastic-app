import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { UserResponse } from "../types";

const modulePath = "/me";
const userPath = "/user";

export const userModule = {
  async getUserMe() {
    try {
      const response: HttpResponse<UserResponse> = await baseApi.get(
        modulePath
      );
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },

  async getUser(userId: string) {
    const response: HttpResponse<UserResponse> = await baseApi.get(
      `${userPath}/${userId}`
    );
    try {
      if (!response.ok) return createGenericProblem(response);
      return response;
    } catch (e: any) {
      // hotfix waiting for thsi to reslove https://github.com/infinitered/apisauce/issues/295
      return { ok: false, problem: "cannot-connect", temporary: true };
    }
  },
};
