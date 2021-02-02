import { CreatorApps, Observation } from "../../../models";
import { Thunk } from "../../store";
import { addFetchedObservations, addNewObservation } from "./slice";
import { NewObservationPayload } from "./types";
import { v4 as uuidv4 } from "uuid";

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

export const submitNewObservation: Thunk<NewObservationPayload> = (
  newObservationPayload
) => async (dispatch, _, { api, localStorage, navigation }) => {
  const newObservation: Observation = {
    id: uuidv4(),
    creatorId: "CREATOR_ID", // Relation with "creator" (model User)
    creatorApp: CreatorApps.DATA_COLLECTION_APP,
    createdAt: new Date(Date.now()).toISOString(),
    updatedAt: new Date(Date.now()).toISOString(),
    isDeleted: false,
    deletedAt: undefined,

    geometry: newObservationPayload.geometry,
    timestamp: newObservationPayload.timestamp.toISOString(),
    comments: newObservationPayload.comments,
    isMatched: false,
    features: [],

    // Temporal (should be part of a feature)
    imageUrl: newObservationPayload.imageUrl,
  };

  const isSuccess: boolean = await api.mockPOSTNewObservation(newObservation);
  if (!isSuccess) await localStorage.queueObservation(newObservation);
  dispatch(addNewObservation(newObservation));
  navigation.navigate("observationList");
};
