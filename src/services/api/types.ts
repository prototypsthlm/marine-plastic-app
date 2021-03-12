import { LitterType, User } from "../../models";

export interface BaseResult<T> {
  ok: boolean;
  data?: T;
  problem?: string;
}

export interface UserResponse {
  result: User;
}

export interface SingleResponse<T> {
  result: T;
}

export interface PagedResponse<T> {
  nextPage: string | null;
  results: Array<T>;
}

export interface LitterTypesResponse {
  results: Array<LitterType>;
}

export type GetUserInfoResult = BaseResult<UserResponse>;
