import {
  CreatorApps,
  Feature,
  FeatureImage,
  Observation,
} from "../../../models";
import { Thunk } from "../../store";
import {
  addFetchedObservations,
  addNewObservation,
  selectObservation,
  setObservationCursor,
} from "./slice";
import { NewObservationPayload } from "./types";
import { generateUUIDv4 } from "../../../utils";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";
import {
  fetchAllFeatureImages,
  resetFeaturesToAdd,
  setFeatureReachedPageEnd,
} from "../features";

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
        getState().campaigns.selectedCampaignEntry?.id || null;
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
      getState().campaigns.selectedCampaignEntry?.id || null;
    const observationEntries: Array<Observation> = await localDB.getEntities<Observation>(
      EntityType.Observation,
      null,
      campaignId
    );
    dispatch(addFetchedObservations(observationEntries));
  } catch (e) {
    console.log({ e });
  }
};

export const submitNewObservation: Thunk<NewObservationPayload> = (
  newObservationPayload
) => async (dispatch, getState, { navigation }) => {
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

  const allFeatureImages: Array<FeatureImage | undefined> = newFeatures
    .filter((f) => f.image !== undefined)
    .map((f) => f.image);

  dispatch(
    submitObservationsAndFeatures({
      observations: [newObservation],
      features: newFeatures,
      featureImages: allFeatureImages,
    })
  );
  dispatch(addNewObservation(newObservation));
  dispatch(resetFeaturesToAdd());
  dispatch(fetchAllFeatureImages());
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

    dispatch(
      submitObservationsAndFeatures({ observations, features, featureImages })
    );
  } catch (e) {
    console.log(e);
  }
};

export const submitObservationsAndFeatures: Thunk<{
  observations: Array<Observation>;
  features: Array<Feature>;
  featureImages: Array<FeatureImage | undefined>;
}> = ({ observations, features, featureImages }) => async (
  dispatch,
  _,
  { api, localDB }
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
            feature.observationId,
            feature.id
          );
        else throw new ActionError("Couldn't post/sync feature.");
      } else {
        // Upsert if success
        const syncedFeature: Feature = response.data?.result;
        await localDB.upsertEntities(
          [syncedFeature],
          EntityType.Feature,
          true,
          null,
          feature.observationId,
          feature.id
        );
      }
    }

    // 3. Upload feature images
    for (let i = 0; i < featureImages.length; i++) {
      // POST endpoint
      const featureImage: FeatureImage | undefined = featureImages[i];
      if (featureImage && featureImage.url) {
        const response = await api.postFeatureImage(featureImage);

        if (!response.ok || !response.data?.result) {
          // Store offline
          if (response.problem === "cannot-connect")
            await localDB.upsertEntities(
              [featureImage],
              EntityType.FeatureImage,
              false,
              null,
              null,
              featureImage.featureId
            );
          else throw new ActionError("Couldn't post/sync feature image.");
        } else {
          // Upsert if success
          await localDB.upsertEntities(
            [featureImage],
            EntityType.FeatureImage,
            true,
            null,
            null,
            featureImage.featureId
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const selectObservationDetails: Thunk<Observation> = (
  observation
) => async (dispatch) => {
  dispatch(selectObservation(observation));
  dispatch(setFeatureReachedPageEnd(false));
};
