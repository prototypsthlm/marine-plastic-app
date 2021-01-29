import { Thunk } from "../../store";
import { addNewObservation } from "./slice";
import { Observation } from "./types";

export const submitNewObservation: Thunk<Observation> = (observation) => (
  dispatch,
  _,
  { navigation }
) => {
  dispatch(addNewObservation(observation));
  navigation.navigate("ObservationList");
};
