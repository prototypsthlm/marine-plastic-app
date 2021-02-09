import {
  CreatorApps,
  Feature,
  FeatureType,
  Observation,
} from "../../../models";
import { Thunk } from "../../store";
import {
  addFetchedFeatureTypes,
  addFetchedObservations,
  addNewFeatureToAdd,
  addNewObservation,
  resetFeaturesToAdd,
  resetFeatureType,
  selectFeatureType,
} from "./slice";
import { NewFeaturePayload, NewObservationPayload } from "./types";
import { generateUUIDv4 } from "../../../utils";

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

export const fetchAllFeatureTypes: Thunk = () => async (
  dispatch,
  _,
  { api }
) => {
  const featureTypeEntries: Array<FeatureType> = await api.mockGETAllFeatureTypes();
  dispatch(addFetchedFeatureTypes(featureTypeEntries));
};

export const submitNewObservation: Thunk<NewObservationPayload> = (
  newObservationPayload
) => async (dispatch, _, { api, localStorage, navigation }) => {
  const newFeatures: Array<Feature> = newObservationPayload.features.map(
    (featurePayload) => ({
      id: generateUUIDv4(),
      creatorId: "CREATOR_ID", // Relation with "creator" (model User)
      creatorApp: CreatorApps.DATA_COLLECTION_APP,
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      isDeleted: false,
      deletedAt: undefined,

      featureTypeId: featurePayload.feaureType.id,
      comments: featurePayload.comments,
      imageUrl: featurePayload.imageUrl,
    })
  );
  const newObservation: Observation = {
    id: generateUUIDv4(),
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
    features: newFeatures,
  };

  const isSuccess: boolean = false; //await api.mockPOSTNewObservation(newObservation);
  if (!isSuccess) await localStorage.queueObservation(newObservation);
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
  dispatch(resetFeatureType());
  navigation.navigate("newObservationScreen");
};

export const addFeatureType: Thunk<FeatureType> = (featureTypePayload) => (
  dispatch,
  _,
  { navigation }
) => {
  dispatch(selectFeatureType(featureTypePayload));
  navigation.navigate("newFeatureScreen");
};
