import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Settings {
    isWelcomeMessageVisible: Boolean;
}

const SETTINGS = "settings";

export const settingsModule = {
  async saveSettings(payload: Settings) {
    try {
      const jsonPayload = JSON.stringify(payload);
      await AsyncStorage.setItem(SETTINGS, jsonPayload);
    } catch (e) {
      console.log("error storing settings entry");
    }
  },

  async getSettings() {
    try {
      const jsonPayload = await AsyncStorage.getItem(SETTINGS);
      if (jsonPayload !== null) return JSON.parse(jsonPayload);
      return null;
    } catch (e) {
      console.log("error getting settings queue");
    }
  },
};
