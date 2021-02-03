import AsyncStorage from "@react-native-async-storage/async-storage";
import { Observation } from "../models";

const QUEUE_NAME = "observations_queue_V2";

const queueObservation = async (payload: Observation) => {
  try {
    const localObservationsStr = await AsyncStorage.getItem(
      "observations_queue_V2"
    );

    if (localObservationsStr !== null) {
      const observationsQueue = JSON.parse(localObservationsStr);

      const newObservationsQueue = [...observationsQueue, payload];

      const jsonPayload = JSON.stringify(newObservationsQueue);
      await AsyncStorage.setItem("observations_queue_V2", jsonPayload);
    } else {
      const jsonPayload = JSON.stringify([payload]);
      await AsyncStorage.setItem("observations_queue_V2", jsonPayload);
    }
    return null;
  } catch (e) {
    console.log("error storing observations entry");
    return e;
  }
};

const getAllQueuedObservations = async () => {
  try {
    const localObservationsStr = await AsyncStorage.getItem(
      "observations_queue_V2"
    );
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
