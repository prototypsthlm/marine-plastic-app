import AsyncStorage from "@react-native-async-storage/async-storage";
import { FeatureType } from "../../../models";

const FEATURE_TYPES = "featureTypes_v2";

export const featureTypesModule = {
  async saveFeatureTypes(payload: Array<FeatureType>) {
    try {
      const jsonPayload = JSON.stringify(payload);
      await AsyncStorage.setItem(FEATURE_TYPES, jsonPayload);
    } catch (e) {
      console.log("error storing featureTypes");
    }
  },

  async getFeatureTypes() {
    try {
      const jsonPayload = await AsyncStorage.getItem(FEATURE_TYPES);
      if (jsonPayload !== null) return JSON.parse(jsonPayload);
      return [];
    } catch (e) {
      console.log("error getting featureTypes");
    }
  },
};
