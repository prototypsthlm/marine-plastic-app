import AsyncStorage from "@react-native-async-storage/async-storage";
import { Observation } from "../models";

const QUEUE_NAME = "observations_queue_V1";

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

const localStorage = {
  queueObservation,
  getAllQueuedObservations,
};

export default localStorage;
