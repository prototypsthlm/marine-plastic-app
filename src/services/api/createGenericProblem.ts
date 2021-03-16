import { ApiResponse } from "apisauce";
import { GenericApiProblem } from "./genericTypes";

function getProblemPayload(
  apiResponse: ApiResponse<any>
): Omit<GenericApiProblem, "ok"> {

  const problemPayload = { 
    originalError: apiResponse.originalError
  }

  switch (apiResponse.problem) {
    case "CONNECTION_ERROR":
    case "NETWORK_ERROR":
      return { ...problemPayload, problem: "cannot-connect", temporary: true};
    case "TIMEOUT_ERROR":
      return { ...problemPayload, problem: "timeout", temporary: true };
    case "SERVER_ERROR":
      return { ...problemPayload, problem: "server" };
    case "UNKNOWN_ERROR":
    default:
      return { ...problemPayload, problem: "unknown", temporary: true };
    case "CLIENT_ERROR":
      switch (apiResponse.status) {
        case 401:
          return { ...problemPayload, problem: "unauthorized" };
        case 403:
          return { ...problemPayload, problem: "forbidden" };
        case 404:
          return { ...problemPayload, problem: "not-found" };
        default:
          return { ...problemPayload, problem: "rejected" };
      }
  }
}

export function createGenericProblem(
  apiResponse: ApiResponse<any>
): GenericApiProblem {
  const payload = getProblemPayload(apiResponse);
  return { ok: false, ...payload };
}
