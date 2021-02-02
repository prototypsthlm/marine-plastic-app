import { create } from "apisauce";
import { Observation } from "../../store/slices/observations";

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

  return apisauceInstance;
};

export const baseApi = createBaseApi();

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
};

export default api;
