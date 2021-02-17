import {
  Campaign,
  CreatorApps,
  Feature,
  FeatureType,
  Observation,
} from "../../../models";
import { Thunk } from "../../store";
import {
  addFetchedCampaigns,
  addFetchedFeatureTypes,
  addFetchedObservations,
  addNewFeatureToAdd,
  addNewObservation,
  resetFeaturesToAdd,
  resetFeatureType,
  selectCampaign,
  selectCampaignless,
  selectFeatureType,
  setCampaignCursor,
  setObservationCursor,
  setObservationReachedPageEnd,
} from "./slice";
import { NewFeaturePayload, NewObservationPayload } from "./types";
import { generateUUIDv4 } from "../../../utils";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";

export const fetchCampaigns: Thunk = () => async (
  dispatch,
  getState,
  { api, localDB }
) => {
  if (
    !getState().observations.campaignReachedPageEnd &&
    getState().ui.isOnline
  ) {
    // 1. Get next page
    const result = await api.getCampaigns(
      getState().observations.campaignNextPageCursor
    );
    if (!result.ok || !result.data?.results)
      throw new ActionError("Couldn't get campaigns.");

    const campaigns: Array<Campaign> = result.data.results;
    const cursor: string | null = result.data?.nextPage;

    // 2. Upsert to localDB
    if (campaigns.length > 0)
      await localDB.upsertEntities(campaigns, EntityType.Campaign, true);

    dispatch(setCampaignCursor(cursor));
  }

  dispatch(fetchAllCampaigns());
};

export const fetchAllCampaigns: Thunk = () => async (
  dispatch,
  _,
  { localDB }
) => {
  try {
    const campaignEntries: Array<Campaign> = await localDB.getEntities<Campaign>(
      EntityType.Campaign
    );
    dispatch(addFetchedCampaigns(campaignEntries));
  } catch (e) {
    console.log({ e });
  }
};

export const fetchObservations: Thunk = () => async (
  dispatch,
  getState,
  { api, localDB }
) => {
  try {
    if (
      !getState().observations.observationReachedPageEnd &&
      getState().ui.isOnline
    ) {
      // 1. Get next page
      const campaignId: string | null =
        getState().observations.selectedCampaignEntry?.id || null;
      const nextPage: string | null = getState().observations
        .observationNextPageCursor;
      const response = await api.getObservations(campaignId, nextPage);

      if (!response.ok || !response.data?.results)
        throw new ActionError("Couldn't get observations.");

      const observationsEntries: Array<Observation> = response.data.results;
      const cursor: string | null = response.data?.nextPage;

      // 2. Upsert to localDB
      if (observationsEntries.length > 0)
        await localDB.upsertEntities(
          observationsEntries,
          EntityType.Observation,
          true,
          campaignId
        );

      dispatch(setObservationCursor(cursor));
    }

    dispatch(fetchAllObservationsFromSelectedCampaign());
  } catch (e) {
    console.log({ e });
  }
};

export const fetchAllObservationsFromSelectedCampaign: Thunk = () => async (
  dispatch,
  getState,
  { localDB }
) => {
  try {
    const campaignId: string | null =
      getState().observations.selectedCampaignEntry?.id || null;
    const observationEntries: Array<Observation> = await localDB.getEntities<Observation>(
      EntityType.Observation,
      campaignId
    );
    dispatch(addFetchedObservations(observationEntries));
  } catch (e) {
    console.log({ e });
  }
};

export const fetchAllFeatureTypes: Thunk = () => async (
  dispatch,
  _,
  { api, localStorage }
) => {
  let featureTypes: Array<FeatureType> = await localStorage.getFeatureTypes();

  if (featureTypes.length < 1) {
    const result = await api.getAllFeatureTypes();
    if (!result.ok || !result.data?.results)
      throw new ActionError("Couldn't get feature types.");

    featureTypes = result.data?.results;

    await localStorage.saveFeatureTypes(featureTypes);
  }
  dispatch(addFetchedFeatureTypes(featureTypes));
};

export const submitNewObservation: Thunk<NewObservationPayload> = (
  newObservationPayload
) => async (dispatch, getState, { navigation }) => {
  const campaignId: string | undefined = getState().observations
    .selectedCampaignEntry?.id;

  const creatorId: string | undefined = getState().account.user?.id;
  if (creatorId === undefined) return;

  const newObservationId: string = generateUUIDv4();
  const newFeatures: Array<Feature> = newObservationPayload.features.map(
    (featurePayload) => ({
      id: generateUUIDv4(),
      creatorId: creatorId,
      creatorApp: CreatorApps.DATA_COLLECTION_APP,
      createdAt: undefined,
      updatedAt: undefined,
      isDeleted: false,
      deletedAt: undefined,

      observationId: newObservationId,
      featureTypeId: featurePayload.feaureType.id,
      imageUrl: featurePayload.imageUrl,

      quantity: featurePayload.quantity,
      quantityUnits: featurePayload.quantityUnits,
      estimatedWeightKg: featurePayload.estimatedWeightKg,
      estimatedSizeM2: featurePayload.estimatedSizeM2,
      estimatedVolumeM3: featurePayload.estimatedVolumeM3,
      depthM: featurePayload.depthM,

      isAbsence: featurePayload.isAbsence,
      isCollected: featurePayload.isCollected,

      comments: featurePayload.comments,
    })
  );
  const newObservation: Observation = {
    id: newObservationId,
    creatorId: creatorId,
    creatorApp: CreatorApps.DATA_COLLECTION_APP,
    createdAt: undefined,
    updatedAt: undefined,
    isDeleted: false,
    deletedAt: undefined,

    campaignId: campaignId || null,
    geometry: newObservationPayload.geometry,
    timestamp: newObservationPayload.timestamp.toISOString(),
    comments: newObservationPayload.comments,
    isMatched: false,
    features: newFeatures,
  };

  dispatch(
    submitObservationsAndFeatures({
      observations: [newObservation],
      features: newFeatures,
    })
  );
  dispatch(addNewObservation(newObservation));
  dispatch(resetFeaturesToAdd());
  navigation.navigate("observationListScreen");
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

export const setSelectedCampaign: Thunk<{
  campaignEntryPayload?: Campaign;
  isCampignless?: boolean;
}> = ({ campaignEntryPayload, isCampignless = false }) => (
  dispatch,
  _,
  { navigation }
) => {
  if (isCampignless) dispatch(selectCampaignless());
  else if (campaignEntryPayload) dispatch(selectCampaign(campaignEntryPayload));
  dispatch(setObservationReachedPageEnd(false));
  dispatch(fetchObservations());
  navigation.navigate("observationListScreen");
};

export const syncOfflineEntries: Thunk = () => async (
  dispatch,
  _,
  { localDB }
) => {
  try {
    const observations: Array<Observation> = await localDB.getEntities<Observation>(
      EntityType.Observation,
      null,
      null,
      false
    );
    const features: Array<Feature> = await localDB.getEntities<Feature>(
      EntityType.Feature,
      null,
      null,
      false
    );

    dispatch(submitObservationsAndFeatures({ observations, features }));
  } catch (e) {
    console.log(e);
  }
};

export const submitObservationsAndFeatures: Thunk<{
  observations: Array<Observation>;
  features: Array<Feature>;
}> = ({ observations, features }) => async (dispatch, _, { api, localDB }) => {
  try {
    // 1. Upload observations
    for (let i = 0; i < observations.length; i++) {
      // POST endpoint
      const observation: Observation = observations[i];
      const response = await api.postObservation(observation);

      if (!response.ok || !response.data?.result) {
        // Store offline
        if (response.problem === "cannot-connect")
          await localDB.upsertEntities(
            [observation],
            EntityType.Observation,
            false,
            observation.campaignId
          );
        else throw new ActionError("Couldn't post observation.");
      } else {
        // Upsert if success
        const syncedObservation: Observation = response.data?.result;
        await localDB.upsertEntities(
          [syncedObservation],
          EntityType.Observation,
          true,
          observation.campaignId
        );
      }
    }

    // 2. Upload features
    for (let i = 0; i < features.length; i++) {
      // POST endpoint
      const feature: Feature = features[i];
      const response = await api.postFeature(feature);

      if (!response.ok || !response.data?.result) {
        // Store offline
        if (response.problem === "cannot-connect")
          await localDB.upsertEntities(
            [feature],
            EntityType.Feature,
            false,
            null,
            feature.observationId
          );
        else throw new ActionError("Couldn't post feature.");
      } else {
        // Upsert if success
        const syncedFeature: Feature = response.data?.result;
        await localDB.upsertEntities(
          [syncedFeature],
          EntityType.Feature,
          true,
          null,
          feature.observationId
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};
