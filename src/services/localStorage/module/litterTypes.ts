import AsyncStorage from "@react-native-async-storage/async-storage";
import { LitterType, Material } from "../../../models";

const LITTER_TYPES = "litterTypes_V2";
const MATERIALS = "materials_V2";

export const measurementsModule = {
  async saveLitterTypes(payload: Array<LitterType>) {
    try {
      const jsonPayload = JSON.stringify(payload);
      await AsyncStorage.setItem(LITTER_TYPES, jsonPayload);
    } catch (e) {
      console.log("error storing litter types");
    }
  },

  async getLitterTypes() {
    try {
      const jsonPayload = await AsyncStorage.getItem(LITTER_TYPES);
      if (jsonPayload !== null) return JSON.parse(jsonPayload);
      return [];
    } catch (e) {
      console.log("error getting litter types");
    }
  },

  async saveMaterials(payload: Array<Material>) {
    try {
      const jsonPayload = JSON.stringify(payload);
      await AsyncStorage.setItem(MATERIALS, jsonPayload);
    } catch (e) {
      console.log("error storing materials");
    }
  },

  async getMaterials() {
    try {
      const jsonPayload = await AsyncStorage.getItem(MATERIALS);
      if (jsonPayload !== null) return JSON.parse(jsonPayload);
      return [];
    } catch (e) {
      console.log("error getting materials");
    }
  },
};
