import { API_URL } from "@env";
import { create } from "apisauce";
import { setUserWithNewToken } from "../../store/slices/session";
import store from "../../store/store";


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

  apisauceInstance.axiosInstance.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await store.dispatch(setUserWithNewToken())
      originalRequest.headers["Authorization"] = `Bearer ${token}`
      return apisauceInstance.axiosInstance(originalRequest);
    }
    return Promise.reject(error);
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
