import AsyncStorage from "@react-native-async-storage/async-storage";
import { Observation, User } from "../models";

const USER = "user";
const QUEUE_NAME = "observations_queue_V2";

const queueObservation = async (payload: Observation) => {
  try {
    const localObservationsStr = await AsyncStorage.getItem(QUEUE_NAME);

    if (localObservationsStr !== null) {
      const observationsQueue = JSON.parse(localObservationsStr);

      const newObservationsQueue = [...observationsQueue, payload];

      const jsonPayload = JSON.stringify(newObservationsQueue);
      await AsyncStorage.setItem(QUEUE_NAME, jsonPayload);
    } else {
      const jsonPayload = JSON.stringify([payload]);
      await AsyncStorage.setItem(QUEUE_NAME, jsonPayload);
    }
  } catch (e) {
    console.log("error storing observations entry");
  }
};

const getAllQueuedObservations = async () => {
  try {
    const localObservationsStr = await AsyncStorage.getItem(QUEUE_NAME);
    if (localObservationsStr !== null) {
      const observationsQueue = JSON.parse(localObservationsStr);
      return observationsQueue;
    }
    return [];
  } catch (e) {
    console.log("error getting observations queue");
  }
};

const saveUser = async (payload: User) => {
  try {
    const jsonPayload = JSON.stringify(payload);
    await AsyncStorage.setItem(USER, jsonPayload);
  } catch (e) {
    console.log("error storing user entry");
  }
};

const getUser = async () => {
  try {
    const jsonPayload = await AsyncStorage.getItem(USER);
    if (jsonPayload !== null) return JSON.parse(jsonPayload);
    return null;
  } catch (e) {
    console.log("error getting user queue");
  }
};

const localStorage = {
  queueObservation,
  getAllQueuedObservations,
  saveUser,
  getUser,
};

export default localStorage;
