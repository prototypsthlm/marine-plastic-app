import { Thunk } from "../../store";
import { addFetchedObservations, addNewObservation } from "./slice";
import { Observation } from "./types";

export const fetchAllObservations: Thunk = () => async (
  dispatch,
  _,
  { api, localStorage }
) => {
  const observationsEntries: Array<Observation> = await api.mockGETAllObservations();
  const localObservationsEntries: Array<Observation> = await localStorage.getAllQueuedObservations();
  dispatch(
    addFetchedObservations([
      ...observationsEntries,
      ...localObservationsEntries,
    ])
  );
};

export const submitNewObservation: Thunk<Observation> = (observation) => async (
  dispatch,
  _,
  { api, localStorage, navigation }
) => {
  const isSuccess: boolean = await api.mockPOSTNewObservation(observation);
  if (!isSuccess) await localStorage.queueObservation(observation);
  dispatch(addNewObservation(observation));
  navigation.navigate("ObservationList");
};
