import { Feature, FeatureImage, FeatureType } from "../../../models";
import { Thunk } from "../../store";
import {
  addFetchedFeatureImages,
  addFetchedFeatures,
  addFetchedFeatureTypes,
  addNewFeatureToAdd,
  resetFeatureType,
  selectFeatureType,
  setFeatureCursor,
} from "./slice";
import { NewFeaturePayload } from "./types";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";

export const fetchFeatures: Thunk = () => async (
  dispatch,
  getState,
  { api, localDB }
) => {
  const isObservationSelected =
    getState().observations.selectedObservationEntry !== undefined;
  if (
    !getState().features.featureReachedPageEnd &&
    getState().ui.isOnline &&
    isObservationSelected
  ) {
    // 1. Get next page
    const result = await api.getFeatures(
      getState().observations.selectedObservationEntry?.id || "",
      getState().features.featureNextPageCursor
    );
    if (!result.ok || !result.data?.results)
      throw new ActionError("Couldn't get/sync features.");

    const features: Array<Feature> = result.data.results;
    const cursor: string | null = result.data?.nextPage;

    // 2. Upsert to localDB
    if (features.length > 0)
      await localDB.upsertEntities(features, EntityType.Feature, true);

    dispatch(setFeatureCursor(cursor));
  }

  dispatch(fetchAllFeatures());
};

export const fetchAllFeatures: Thunk = () => async (
  dispatch,
  _,
  { localDB }
) => {
  try {
    const featureEntries: Array<Feature> = await localDB.getEntities<Feature>(
      EntityType.Feature
    );
    dispatch(addFetchedFeatures(featureEntries));
  } catch (e) {
    console.log({ e });
  }
};

export const fetchAllFeatureImages: Thunk = () => async (
  dispatch,
  _,
  { localDB }
) => {
  try {
    const featureImages: Array<FeatureImage> = await localDB.getEntities<FeatureImage>(
      EntityType.FeatureImage
    );
    dispatch(addFetchedFeatureImages(featureImages));
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
      throw new ActionError("Couldn't get/sync feature types.");

    featureTypes = result.data?.results;

    await localStorage.saveFeatureTypes(featureTypes);
  }
  dispatch(addFetchedFeatureTypes(featureTypes));
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

export const processSubmitFeatures = async (
  api: any,
  localDB: any,
  features: Array<Feature>
) => {
  try {
    // Upload features
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
  } catch (e) {
    console.log(e);
  }
};

export const processSubmitFeatureImages = async (
  api: any,
  localDB: any,
  featureImages: Array<FeatureImage | undefined>
) => {
  try {
    // Upload feature images
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
