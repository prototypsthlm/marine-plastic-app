import { baseApi } from "../api";
import { createGenericProblem } from "../createGenericProblem";
import { HttpResponse } from "../genericTypes";

import featureTypes from "../../../assets/mockdata/featureTypes.json";

const modulePath = "/featureTypes";

export const featureTypesModule = {
  async mockGETAllFeatureTypes() {
    return featureTypes.results;
  },
};
