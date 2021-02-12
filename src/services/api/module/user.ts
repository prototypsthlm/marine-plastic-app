import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";
import { UserResponse } from "../types";

const modulePath = "/me";

export const userModule = {
  async getUserMe() {
    const response: HttpResponse<UserResponse> = await baseApi.get(modulePath);
    if (!response.ok) return createGenericProblem(response);
    return response;
  },
};
