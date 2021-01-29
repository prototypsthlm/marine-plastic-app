import AsyncStorage from "@react-native-async-storage/async-storage";
import { Observation } from "../store/slices/observations";

const queueObservation = async (payload: Observation) => {
  try {
    const localObservationsStr = await AsyncStorage.getItem(
      "observations_queue"
    );

    if (localObservationsStr !== null) {
      const observationsQueue = JSON.parse(localObservationsStr);

      const newObservationsQueue = [...observationsQueue, payload];

      const jsonPayload = JSON.stringify(newObservationsQueue);
      await AsyncStorage.setItem("observations_queue", jsonPayload);
    } else {
      const jsonPayload = JSON.stringify([payload]);
      await AsyncStorage.setItem("observations_queue", jsonPayload);
    }
  } catch (e) {
    console.log("error storing observations entry");
  }
};

const getAllQueuedObservations = async () => {
  try {
    const localObservationsStr = await AsyncStorage.getItem(
      "observations_queue"
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
