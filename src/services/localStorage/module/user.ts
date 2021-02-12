import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../../models";

const USER = "user";

export const userModule = {
  async saveUser(payload: User) {
    try {
      const jsonPayload = JSON.stringify(payload);
      await AsyncStorage.setItem(USER, jsonPayload);
    } catch (e) {
      console.log("error storing user entry");
    }
  },

  async getUser() {
    try {
      const jsonPayload = await AsyncStorage.getItem(USER);
      if (jsonPayload !== null) return JSON.parse(jsonPayload);
      return null;
    } catch (e) {
      console.log("error getting user queue");
    }
  },
};
