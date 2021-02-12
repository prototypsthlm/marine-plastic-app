import { ApiResponse } from "apisauce";
import { GenericApiProblem } from "./genericTypes";

function getProblemPayload(
  apiResponse: ApiResponse<any>
): Omit<GenericApiProblem, "ok"> {
  switch (apiResponse.problem) {
    case "CONNECTION_ERROR":
    case "NETWORK_ERROR":
      return { problem: "cannot-connect", temporary: true };
    case "TIMEOUT_ERROR":
      return { problem: "timeout", temporary: true };
    case "SERVER_ERROR":
      return { problem: "server" };
    case "UNKNOWN_ERROR":
    default:
      return { problem: "unknown", temporary: true };
    case "CLIENT_ERROR":
      switch (apiResponse.status) {
        case 401:
          return { problem: "unauthorized" };
        case 403:
          return { problem: "forbidden" };
        case 404:
          return { problem: "not-found" };
        default:
          return { problem: "rejected" };
      }
  }
}

export function createGenericProblem(
  apiResponse: ApiResponse<any>
): GenericApiProblem {
  const payload = getProblemPayload(apiResponse);
  return { ok: false, ...payload };
}
