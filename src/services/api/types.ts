import { User } from "../../models";

export interface BaseResult<T> {
  ok: boolean;
  data?: T;
  problem?: string;
}

export interface UserResponse {
  result: User;
}

export type GetUserInfoResult = BaseResult<UserResponse>;
