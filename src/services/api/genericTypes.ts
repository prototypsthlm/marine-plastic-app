import { ApiErrorResponse, ApiOkResponse } from "apisauce";

export type HttpResponse<T> = ApiErrorResponse<void> | ApiOkResponse<T>;

export interface GenericApiProblem {
  ok: false;
  problem: ApiErrorTypes;
  originalError?: any;
  temporary?: boolean;
}

export type ApiErrorTypes =
  | "timeout"
  | "cannot-connect"
  | "server"
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "rejected"
  | "unknown"
  | "bad-data";
