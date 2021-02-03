import { CreatorApps, Feature, Observation } from "../../../models";
import { Thunk } from "../../store";
import {
  addFetchedObservations,
  addNewFeatureToAdd,
  addNewObservation,
  displayError,
  resetFeaturesToAdd,
} from "./slice";
import { NewFeaturePayload, NewObservationPayload } from "./types";
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
  const newFeatures: Array<Feature> = newObservationPayload.features.map(
    (featurePayload) => ({
      id: uuidv4(),
      creatorId: "CREATOR_ID", // Relation with "creator" (model User)
      creatorApp: CreatorApps.DATA_COLLECTION_APP,
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      isDeleted: false,

      comments: featurePayload.comments,
      imageUrl: featurePayload.imageUrl,
    })
  );
  const newObservation: Observation = {
    id: uuidv4(),
    creatorId: "CREATOR_ID", // Relation with "creator" (model User)
    creatorApp: CreatorApps.DATA_COLLECTION_APP,
    createdAt: new Date(Date.now()).toISOString(),
    updatedAt: new Date(Date.now()).toISOString(),
    isDeleted: false,

    geometry: newObservationPayload.geometry,
    timestamp: newObservationPayload.timestamp.toISOString(),
    comments: newObservationPayload.comments,
    isMatched: false,
    features: newFeatures,
  };

  const isSuccess: boolean = false; //await api.mockPOSTNewObservation(newObservation);
  if (!isSuccess) {
    const e = await localStorage.queueObservation(newObservation);
    dispatch(displayError(e));
  }
  dispatch(addNewObservation(newObservation));
  dispatch(resetFeaturesToAdd());
  navigation.navigate("observationList");
};

export const addNewFeature: Thunk<NewFeaturePayload> = (newFeaturePayload) => (
  dispatch,
  _,
  { navigation }
) => {
  dispatch(addNewFeatureToAdd(newFeaturePayload));
  navigation.navigate("newObservationScreen");
};
