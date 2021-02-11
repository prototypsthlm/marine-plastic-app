import { create } from "apisauce";
import { Observation } from "../../models";
import featureTypes from "../../assets/mockdata/featureTypes.json";
import campaigns from "../../assets/mockdata/campaigns.json";

const API_URL = "https://petstore.swagger.io/v2";

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

  apisauceInstance.axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      // if (error.response.status === 401) store.dispatch(logOut());

      // const originalRequest = error.config;

      // if (error.response.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;
      //   // TODO: Refresh token
      //   return apisauceInstance.axiosInstance(originalRequest);
      // }

      return Promise.reject(error);
    }
  );

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

const api = {
  // Mock functions: just returns true if request is successful 200
  async mockGETAllObservations() {
    // Try to GET all observations...
    // const response = await baseApi.get("/store/inventory");
    return [];
  },
  async mockPOSTNewObservation(observation: Observation) {
    // Try to POST new observation...
    return false;
  },
  async mockGETAllFeatureTypes() {
    return featureTypes.results;
  },
  async mockGETAllCampaigns() {
    return campaigns.results;
  },
};

export default api;
