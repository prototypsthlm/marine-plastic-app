import { FeatureType, User } from "../../models";

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

export interface FeatureTypesResponse {
  results: Array<FeatureType>;
}

export type GetUserInfoResult = BaseResult<UserResponse>;
