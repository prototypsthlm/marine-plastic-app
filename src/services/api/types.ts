import { Campaign, FeatureType, User } from "../../models";

export interface BaseResult<T> {
  ok: boolean;
  data?: T;
  problem?: string;
}

export interface UserResponse {
  result: User;
}

export interface CampaignsResponse {
  nextPage: string | null;
  results: Array<Campaign>;
}

export interface FeatureTypesResponse {
  results: Array<FeatureType>;
}

export type GetUserInfoResult = BaseResult<UserResponse>;
