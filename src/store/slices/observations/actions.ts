import {
  CreatorApps,
  Measurement,
  Observation,
  ObservationImage,
  UnitEnum,
} from "../../../models";
import { Thunk } from "../../store";
import { setIsSyncing } from "../ui";
import {
  addEditedObservation,
  addFetchedObservations,
  addFetchedObservationImages,
  addNewObservation,
  resetPagination,
  selectObservation,
  setFetchedObservations,
  setObservationCursor,
  setRefreshing,
  addFetchedObservationUser,
} from "./slice";
import { EditObservationPayload, NewObservationPayload } from "./types";
import { generateUUIDv4 } from "../../../utils";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";
import {
  processSubmitObservationImages,
  processSubmitMeasurements,
  resetMeasurementsToAdd,
  resetPagination as resetFeaturePagination,
} from "../measurements";
import { Alert } from "react-native";

export const fetchObservations: Thunk<{ forceRefresh?: boolean }> =
  (options) =>
  async (dispatch, getState, { api, localDB }) => {
    try {
      if (getState().observations.refreshing) return;
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
          throw new ActionError(
            `Couldn't get observations: ${response.problem} ${response.originalError.message}`
          );

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

export const fetchCachedObservations: Thunk =
  () =>
  async (dispatch, getState, { localDB }) => {
    try {
      const campaignId: string | null =
        getState().campaigns.selectedCampaignEntry?.id || null;
      const observationEntries: Array<Observation> =
        await localDB.getEntities<Observation>(
          EntityType.Observation,
          null,
          campaignId
        );
      dispatch(setFetchedObservations(observationEntries));
    } catch (e) {
      console.log({ e });
    }
  };

export const fetchCachedObservationImages: Thunk =
  () =>
  async (dispatch, _, { localDB }) => {
    try {
      const observationImages: Array<ObservationImage> =
        await localDB.getEntities<ObservationImage>(
          EntityType.ObservationImage
        );
      dispatch(addFetchedObservationImages(observationImages));
    } catch (e) {
      console.log({ e });
    }
  };
export const fetchObservationCreator: Thunk<{ creatorId: string }> =
  ({ creatorId }) =>
  async (dispatch, getState, { api }) => {
    try {
      const response = await api.getUser(creatorId);
      if (!response.ok || !response.data?.result) {
        throw Error("failed to fetch observation creator");
      } else {
        if (
          !getState().observations.observationUsers.find(
            (x) => x.id === response.data?.result.id
          )
        ) {
          dispatch(addFetchedObservationUser(response.data?.result));
        }
      }
    } catch (e) {
      console.log({ e });
    }
  };
export const submitNewObservation: Thunk<NewObservationPayload> =
  (newObservationPayload) =>
  async (dispatch, getState, { api, localDB, navigation }) => {
    try {
      const campaignId: string | undefined =
        getState().campaigns.selectedCampaignEntry?.id;

      const creatorId: string | undefined = getState().account.user?.id;
      if (creatorId === undefined) return;

      const newObservationId: string = generateUUIDv4();
      const newMeasurements: Array<Measurement> =
        newObservationPayload.measurements.map((measurementPayload) => {
          const measurementId: string = generateUUIDv4();
          return {
            id: measurementId,
            creatorId: creatorId,
            creatorApp: CreatorApps.DATA_COLLECTION_APP,
            createdAt: undefined,
            updatedAt: undefined,
            isDeleted: false,
            deletedAt: undefined,

            observationId: newObservationId,
            quantityKg:
              measurementPayload.unit == UnitEnum.KG
                ? measurementPayload.quantity
                : undefined,
            quantityItemsPerM2:
              measurementPayload.unit == UnitEnum.ITEMS_PER_M2
                ? measurementPayload.quantity
                : undefined,
            quantityItemsPerM3:
              measurementPayload.unit == UnitEnum.ITEMS_PER_M3
                ? measurementPayload.quantity
                : undefined,
            quantityPercentOfSurface:
              measurementPayload.unit == UnitEnum.PERCENT_OF_SURFACE
                ? measurementPayload.quantity
                : undefined,
            quantityPercentOfWeight:
              measurementPayload.unit == UnitEnum.PERCENT_OF_WEIGHT
                ? measurementPayload.quantity
                : undefined,
            quantityGramPerLiter:
              measurementPayload.unit == UnitEnum.GRAM_PER_LITER
                ? measurementPayload.quantity
                : undefined,
            isApproximate: measurementPayload.isApproximate,
            isCollected: measurementPayload.isCollected,
            material: measurementPayload.material,
          };
        });
      const newObservation: Observation = {
        id: newObservationId,
        creatorId: creatorId,
        creatorApp: CreatorApps.DATA_COLLECTION_APP,
        createdAt: undefined,
        updatedAt: undefined,
        isDeleted: false,
        deletedAt: undefined,

        images: newObservationPayload.imageUrl
          ? [
              {
                id: generateUUIDv4(),
                creatorId: creatorId,
                creatorApp: CreatorApps.DATA_COLLECTION_APP,
                observationId: newObservationId,
                url: newObservationPayload.imageUrl,
              },
            ]
          : undefined,
        campaignId: campaignId || null,
        geometry: newObservationPayload.geometry,
        timestamp: newObservationPayload.timestamp.toISOString(),
        class: newObservationPayload.class,
        estimatedAreaAboveSurfaceM2:
          newObservationPayload.estimatedAreaAboveSurfaceM2,
        estimatedPatchAreaM2: newObservationPayload.estimatedPatchAreaM2,
        estimatedFilamentLengthM:
          newObservationPayload.estimatedFilamentLengthM,
        depthM: newObservationPayload.depthM,
        comments: newObservationPayload.comments,
        isControlled: newObservationPayload.isControlled,
        isAbsence: newObservationPayload.isAbsence,
        measurements: newMeasurements,
      };

      const allObservationImages: Array<ObservationImage> =
        newObservation.images || [];

      await processSubmitObservation(api, localDB, [newObservation]);
      await processSubmitObservationImages(api, localDB, allObservationImages);
      await processSubmitMeasurements(api, localDB, newMeasurements);

      dispatch(addNewObservation(newObservation));
      dispatch(resetMeasurementsToAdd());
      dispatch(fetchCachedObservationImages());
      dispatch(fetchObservations({}));
      navigation.navigate("observationListScreen");
    } catch (e) {
      console.log(e);
    }
  };

export const submitEditObservation: Thunk<EditObservationPayload> =
  (editObservationPayload) =>
  async (dispatch, getState, { api, localDB, navigation }) => {
    // 1. Patch to backend
    const currentObservation: Observation | undefined =
      getState().observations.selectedObservationEntry;
    if (!currentObservation) return;
    const response = await api.patchObservation(
      currentObservation,
      editObservationPayload
    );

    // 2. Upsert to localDB
    if (!response.ok || !response.data?.result) {
      throw new ActionError(
        `Couldn't sync updated observation: ${response.problem} ${response.originalError.message}`
      );
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

export const clearOfflineEntries: Thunk =
  () =>
  async (dispatch, _, { localDB }) => {
    try {
      const observations: Array<Observation> =
        await localDB.getEntities<Observation>(EntityType.Observation, false);
      const measurements: Array<Measurement> =
        await localDB.getEntities<Measurement>(EntityType.Measurement, false);

      const observationImages: Array<ObservationImage> =
        await localDB.getEntities<ObservationImage>(
          EntityType.ObservationImage,
          false
        );

      // collect all ids
      const idsToDelete = [
        ...observations.map((o) => o.id),
        ...observationImages.map((om) => om.id),
        ...measurements.map((m) => m.id),
      ];

      // delete collected ids
      if (idsToDelete.length > 0) await localDB.deleteEntities(idsToDelete);
    } catch (e) {
      console.log(e);
    }
  };

export const syncOfflineEntries: Thunk =
  () =>
  async (dispatch, getState, { api, localDB }) => {
    if (!getState().ui.isSyncing) {
      dispatch(setIsSyncing(true));

      try {
        const observations: Array<Observation> =
          await localDB.getEntities<Observation>(EntityType.Observation, false);
        const measurements: Array<Measurement> =
          await localDB.getEntities<Measurement>(EntityType.Measurement, false);

        const observationImages: Array<ObservationImage> =
          await localDB.getEntities<ObservationImage>(
            EntityType.ObservationImage,
            false
          );

        await processSubmitObservation(api, localDB, observations);
        await processSubmitMeasurements(api, localDB, measurements);
        await processSubmitObservationImages(api, localDB, observationImages);
      } catch (e) {
        console.log(e);
      }

      dispatch(setIsSyncing(false));
    }
  };

export const selectObservationDetails: Thunk<Observation> =
  (observation) => (dispatch) => {
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
        if (
          response.problem === "cannot-connect" ||
          response.problem === "unknown" ||
          response.problem === "timeout"
        ) {
          await localDB.upsertEntities(
            [observation],
            EntityType.Observation,
            false,
            observation.campaignId
          );
        } else
          throw new ActionError(
            `Couldn't post/sync observation: ${response.problem} ${response.originalError.message}`
          );
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

export const deleteObservation: Thunk =
  () =>
  async (dispatch, getState, { api, localDB, navigation }) => {
    // Delete Observation from backend
    const currentObservation: Observation | undefined =
      getState().observations.selectedObservationEntry;
    if (!currentObservation) return;
    const response = await api.deleteObservation(currentObservation);

    if (!response.ok) {
      throw new ActionError(
        `Couldn't delete observation: ${response.problem} ${response.originalError.message}`
      );
    } else {
      // If success, delete from localDB
      const observationId: string = currentObservation.id;
      const observationMeasurements: Array<Measurement> =
        getState().measurements.measurementEntries.filter(
          (f) => f.observationId === observationId
        );
      const measurementIds: Array<string> = observationMeasurements.map(
        (m) => m.id
      );

      const observationImages: Array<ObservationImage> =
        getState().observations.observationImages.filter(
          (fi) => fi.observationId === observationId
        );
      const observationImageIds: Array<string> = observationImages.map(
        (fi) => fi.id
      );
      const ids: Array<string> = [
        observationId,
        ...measurementIds,
        ...observationImageIds,
      ];

      if (ids.length > 0) await localDB.deleteEntities(ids);

      dispatch(fetchCachedObservations());
      navigation.goBack();
      navigation.goBack(); // go back twice, otherwise the deletet Observation will be shown again
    }
  };
