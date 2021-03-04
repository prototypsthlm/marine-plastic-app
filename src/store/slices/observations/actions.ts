import {
  CreatorApps,
  Feature,
  FeatureImage,
  Observation,
} from "../../../models";
import { Thunk } from "../../store";
import {
  addEditedObservation,
  addFetchedObservations,
  addNewObservation,
  resetPagination,
  selectObservation,
  setFetchedObservations,
  setObservationCursor,
  setRefreshing,
} from "./slice";
import { EditObservationPayload, NewObservationPayload } from "./types";
import { generateUUIDv4 } from "../../../utils";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";
import {
  fetchCachedFeatureImages,
  processSubmitFeatureImages,
  processSubmitFeatures,
  resetFeaturesToAdd,
  resetPagination as resetFeaturePagination,
} from "../features";

export const fetchObservations: Thunk<{ forceRefresh?: boolean }> = (
  options
) => async (dispatch, getState, { api, localDB }) => {
  try {
    dispatch(setRefreshing(true));
    const { forceRefresh } = options;
    const refresh: boolean = forceRefresh || false;
    if (
      (refresh || !getState().observations.reachedPageEnd) &&
      getState().ui.isOnline
    ) {
      if (refresh && getState().observations.reachedPageEnd)
        dispatch(resetPagination());

      // 1. Get next page
      const campaignId: string | null =
        getState().campaigns.selectedCampaignEntry?.id || null;
      const nextPage: string | null = getState().observations.nextPageCursor;
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
      dispatch(addFetchedObservations(observationsEntries));
    }

    if (!getState().ui.isOnline) {
      dispatch(fetchCachedObservations());
    }

    dispatch(setRefreshing(false));
  } catch (e) {
    console.log({ e });
    dispatch(setRefreshing(false));
  }
};

export const fetchCachedObservations: Thunk = () => async (
  dispatch,
  getState,
  { localDB }
) => {
  try {
    const campaignId: string | null =
      getState().campaigns.selectedCampaignEntry?.id || null;
    const observationEntries: Array<Observation> = await localDB.getEntities<Observation>(
      EntityType.Observation,
      null,
      campaignId
    );
    dispatch(setFetchedObservations(observationEntries));
  } catch (e) {
    console.log({ e });
  }
};

export const submitNewObservation: Thunk<NewObservationPayload> = (
  newObservationPayload
) => async (dispatch, getState, { api, localDB, navigation }) => {
  try {
    const campaignId: string | undefined = getState().campaigns
      .selectedCampaignEntry?.id;

    const creatorId: string | undefined = getState().account.user?.id;
    if (creatorId === undefined) return;

    const newObservationId: string = generateUUIDv4();
    const newFeatures: Array<Feature> = newObservationPayload.features.map(
      (featurePayload) => {
        const featureId: string = generateUUIDv4();
        return {
          id: featureId,
          creatorId: creatorId,
          creatorApp: CreatorApps.DATA_COLLECTION_APP,
          createdAt: undefined,
          updatedAt: undefined,
          isDeleted: false,
          deletedAt: undefined,

          observationId: newObservationId,
          featureTypeId: featurePayload.feaureType.id,
          imageUrl: featurePayload.imageUrl,
          image: featurePayload.imageUrl
            ? {
                id: generateUUIDv4(),
                creatorId: creatorId,
                creatorApp: CreatorApps.DATA_COLLECTION_APP,
                featureId: featureId,
                url: featurePayload.imageUrl,
              }
            : undefined,

          quantity: featurePayload.quantity,
          quantityUnits: featurePayload.quantityUnits,
          estimatedWeightKg: featurePayload.estimatedWeightKg,
          estimatedSizeM2: featurePayload.estimatedSizeM2,
          estimatedVolumeM3: featurePayload.estimatedVolumeM3,
          depthM: featurePayload.depthM,

          isAbsence: featurePayload.isAbsence,
          isCollected: featurePayload.isCollected,

          comments: featurePayload.comments,
        };
      }
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

    const allFeatureImages: Array<
      FeatureImage | undefined
    > = newFeatures.filter((f) => f.image !== undefined).map((f) => f.image);

    await processSubmitObservation(api, localDB, [newObservation]);
    await processSubmitFeatures(api, localDB, newFeatures);
    await processSubmitFeatureImages(api, localDB, allFeatureImages);

    dispatch(addNewObservation(newObservation));
    dispatch(resetFeaturesToAdd());
    dispatch(fetchCachedFeatureImages());
    navigation.navigate("observationListScreen");
  } catch (e) {
    console.log(e);
  }
};

export const submitEditObservation: Thunk<EditObservationPayload> = (
  editObservationPayload
) => async (dispatch, getState, { api, localDB, navigation }) => {
  // 1. Patch to backend
  const currentObservation: Observation | undefined = getState().observations
    .selectedObservationEntry;
  if (!currentObservation) return;
  const response = await api.patchObservation(
    currentObservation,
    editObservationPayload
  );

  // 2. Upsert to localDB
  if (!response.ok || !response.data?.result) {
    throw new ActionError("Couldn't sync updated observation.");
  } else {
    // Upsert if success
    const updatedObservation: Observation = {
      ...currentObservation,
      ...editObservationPayload,
    };
    await localDB.upsertEntities(
      [updatedObservation],
      EntityType.Observation,
      true,
      updatedObservation.campaignId
    );

    // 3. Refresh store with new data
    dispatch(addEditedObservation(updatedObservation));
    dispatch(selectObservationDetails(updatedObservation));

    navigation.goBack();
  }
};

export const syncOfflineEntries: Thunk = () => async (
  _dispatch,
  _,
  { api, localDB }
) => {
  try {
    const observations: Array<Observation> = await localDB.getEntities<Observation>(
      EntityType.Observation,
      false
    );
    const features: Array<Feature> = await localDB.getEntities<Feature>(
      EntityType.Feature,
      false
    );
    const featureImages: Array<FeatureImage> = await localDB.getEntities<FeatureImage>(
      EntityType.FeatureImage,
      false
    );

    await processSubmitObservation(api, localDB, observations);
    await processSubmitFeatures(api, localDB, features);
    await processSubmitFeatureImages(api, localDB, featureImages);
  } catch (e) {
    console.log(e);
  }
};

export const selectObservationDetails: Thunk<Observation> = (observation) => (
  dispatch
) => {
  dispatch(selectObservation(observation));
  dispatch(resetFeaturePagination());
};

export const processSubmitObservation = async (
  api: any,
  localDB: any,
  observations: Array<Observation>
) => {
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
        else throw new ActionError("Couldn't post/sync observation.");
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
  } catch (e) {
    console.log(e);
  }
};

export const deleteObservation: Thunk = () => async (
  dispatch,
  getState,
  { api, localDB, navigation }
) => {
  // Delete Observation from backend
  const currentObservation: Observation | undefined = getState().observations
    .selectedObservationEntry;
  if (!currentObservation) return;
  const response = await api.deleteObservation(currentObservation);

  if (!response.ok) {
    throw new ActionError("Couldn't delete observation.");
  } else {
    // If success, delete from localDB
    const observationId: string = currentObservation.id;
    const observationFeatures: Array<Feature> = getState().features.featureEntries.filter(
      (f) => f.observationId === observationId
    );
    const featureIds: Array<string> = observationFeatures.map((f) => f.id);
    const featureImages: Array<FeatureImage> = getState().features.featureImages.filter(
      (f) => featureIds.includes(f.featureId)
    );
    const featureImageIds: Array<string> = featureImages.map((f) => f.id);
    const ids: Array<string> = [
      observationId,
      ...featureIds,
      ...featureImageIds,
    ];
    if (ids.length > 0) await localDB.deleteEntities(ids);

    dispatch(fetchCachedObservations());
    navigation.goBack();
  }
};
