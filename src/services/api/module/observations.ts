import { Observation } from "../../../models";
import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";

const modulePath = "/observations";

export const observationsModule = {
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
