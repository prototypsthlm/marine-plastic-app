import { create } from "apisauce";

const API_URL = "https://api-test.oceanscan.org/api/dca-v0";

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
    console.log("MONITORING_RESPONSE: ", response);
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
