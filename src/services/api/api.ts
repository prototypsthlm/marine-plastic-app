import { API_URL } from "@env";
import { create } from "apisauce";


const createBaseApi = () => {
  console.log("Creating baseApi with: ", API_URL);
  const apisauceInstance = create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  apisauceInstance.addMonitor((response) => {
    console.trace("MONITORING_RESPONSE: ", response);
  });

  return apisauceInstance;
};

export const baseApi = createBaseApi();

export const addTokenToRequestPayloads = (token: string): void => {
  // After having a valid auth token we append it to all future requests' payloads
  baseApi.setHeader("Authorization", `Bearer ${token}`);
};

export const clearTokenFromRequestPayloads = (): void => {
  baseApi.setHeader("Authorization", "");
};
