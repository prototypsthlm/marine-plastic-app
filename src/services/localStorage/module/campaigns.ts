import AsyncStorage from "@react-native-async-storage/async-storage";
import { Campaign } from "../../../models";

const CAMPAIGNS = "campaigns";

export const campaignsModule = {
  async saveCampaigns(payload: Array<Campaign>) {
    try {
      const jsonPayload = JSON.stringify(payload);
      await AsyncStorage.setItem(CAMPAIGNS, jsonPayload);
    } catch (e) {
      console.log("error storing campaigns");
    }
  },

  async getCampaigns() {
    try {
      const jsonPayload = await AsyncStorage.getItem(CAMPAIGNS);
      if (jsonPayload !== null) return JSON.parse(jsonPayload);
      return [];
    } catch (e) {
      console.log("error getting campaigns");
    }
  },
};
