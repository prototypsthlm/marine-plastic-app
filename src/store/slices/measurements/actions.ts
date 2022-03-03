import {
  Measurement,
  LitterType,
  ObservationImage,
  Material,
} from "../../../models";
import { Thunk } from "../../store";
import {
  addEditedMeasurement,
  addFetchedMeasurements,
  addFetchedLitterTypes,
  addFetchedMaterials,
  addNewMeasurementToAdd,
  resetLitterType,
  resetPagination,
  selectMeasurement,
  selectLitterType,
  setMeasurementCursor,
  setFetchedMeasurements,
  setRefreshing,
} from "./slice";
import { EditMeasurementPayload, NewMeasurementPayload } from "./types";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";

export const fetchMeasurements: Thunk<{ forceRefresh?: boolean }> =
  (options) =>
  async (dispatch, getState, { api, localDB }) => {
    if (getState().measurements.refreshing) return;
    dispatch(setRefreshing(true));
    const { forceRefresh } = options;
    const refresh: boolean = forceRefresh || false;
    const isObservationSelected =
      getState().observations.selectedObservationEntry !== undefined;
    if (
      (refresh || !getState().measurements.reachedPageEnd) &&
      getState().ui.isOnline &&
      isObservationSelected
    ) {
      if (refresh && getState().measurements.reachedPageEnd)
        dispatch(resetPagination());

      // 1. Get next page
      const result = await api.getMeasurements(
        getState().observations.selectedObservationEntry?.id || "",
        getState().measurements.nextPageCursor
      );
      if (!result.ok || !result.data?.results)
        throw new ActionError("Couldn't get/sync measurements.");

      const measurements: Array<Measurement> = result.data.results;
      const cursor: string | null = result.data?.nextPage;

      // 2. Upsert to localDB
      if (measurements.length > 0)
        await localDB.upsertEntities(
          measurements,
          EntityType.Measurement,
          true
        );

      dispatch(setMeasurementCursor(cursor));
      dispatch(addFetchedMeasurements(measurements));
    }

    if (!getState().ui.isOnline) {
      dispatch(fetchCachedMeasurements());
    }
    dispatch(setRefreshing(false));
  };

export const fetchCachedMeasurements: Thunk =
  () =>
  async (dispatch, _, { localDB }) => {
    try {
      const measurementEntries: Array<Measurement> =
        await localDB.getEntities<Measurement>(EntityType.Measurement);
      dispatch(setFetchedMeasurements(measurementEntries));
    } catch (e) {
      console.log({ e });
    }
  };

export const fetchAllLitterTypes: Thunk =
  () =>
  async (dispatch, _, { api, localStorage }) => {
    let litterTypes: Array<LitterType> = await localStorage.getLitterTypes();

    if (litterTypes.length < 1) {
      const result = await api.getAllLitterTypes();
      if (!result.ok || !result.data?.results)
        throw new ActionError(
          `Couldn't get/sync litter types: ${
            result.problem ?? result.problem
          } ${result.originalError ?? result.originalError.message}`
        );

      litterTypes = result.data?.results;

      await localStorage.saveLitterTypes(litterTypes);
    }
    dispatch(addFetchedLitterTypes(litterTypes));
  };

export const fetchAllMaterials: Thunk =
  () =>
  async (dispatch, _, { api, localStorage }) => {
    let materials: Array<Material> = await localStorage.getMaterials();

    if (materials.length < 1) {
      const result = await api.getAllMaterials();
      if (!result.ok || !result.data?.results)
        throw new ActionError(
          `Couldn't get/sync materials: ${result.problem ?? result.problem} ${
            result.originalError ?? result.originalError.message
          }`
        );

      materials = result.data?.results;

      await localStorage.saveMaterials(materials);
    }
    dispatch(addFetchedMaterials(materials));
  };

export const addNewMeasurement: Thunk<NewMeasurementPayload> =
  (newMeasurementPayload) =>
  (dispatch, _, { navigation }) => {
    dispatch(addNewMeasurementToAdd(newMeasurementPayload));
    dispatch(resetLitterType());
    navigation.navigate("newObservationScreen");
  };

export const addLitterType: Thunk<LitterType> =
  (litterTypePayload) =>
  (dispatch, _, { navigation }) => {
    dispatch(selectLitterType(litterTypePayload));
    navigation.goBack();
  };

export const submitEditMeasurement: Thunk<EditMeasurementPayload> =
  (editMeasurementPayload) =>
  async (dispatch, getState, { api, localDB, navigation }) => {
    // 1. Patch to backend
    const currentMeasurement: Measurement | undefined =
      getState().measurements.selectedMeasurementEntry;
    if (!currentMeasurement) return;
    const response = await api.patchMeasurement(
      currentMeasurement,
      editMeasurementPayload
    );

    // 2. Upsert to localDB
    if (!response.ok || !response.data?.result) {
      throw new ActionError(
        `Couldn't sync updated feature: ${response.problem} ${response.originalError.message}`
      );
    } else {
      // Upsert if success
      const updatedMeasurement: Measurement = {
        ...currentMeasurement,
        ...editMeasurementPayload,
      };
      await localDB.upsertEntities(
        [updatedMeasurement],
        EntityType.Measurement,
        true,
        null,
        updatedMeasurement.observationId
      );

      // 3. Refresh store with new data
      dispatch(addEditedMeasurement(updatedMeasurement));
      dispatch(selectMeasurement(updatedMeasurement));

      navigation.goBack();
    }
  };

export const processSubmitMeasurements = async (
  api: any,
  localDB: any,
  measurements: Array<Measurement>
) => {
  try {
    // Upload features
    for (let i = 0; i < measurements.length; i++) {
      // POST endpoint
      const measurement: Measurement = measurements[i];
      const response = await api.postMeasurement(measurement);

      if (!response.ok || !response.data?.result) {
        // Store offline

        if (
          response.problem === "cannot-connect" ||
          response.problem === "timeout"
        ) {
          await localDB.upsertEntities(
            [measurement],
            EntityType.Measurement,
            false,
            null,
            measurement.observationId,
            measurement.id
          );
        } else
          throw new ActionError(
            `Couldn't post/sync measurement: ${response.problem} ${response.originalError.message}`
          );
      } else {
        // Upsert if success
        const syncedMeasurement: Measurement = response.data?.result;
        await localDB.upsertEntities(
          [syncedMeasurement],
          EntityType.Measurement,
          true,
          null,
          syncedMeasurement.observationId,
          syncedMeasurement.id
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const processSubmitObservationImages = async (
  api: any,
  localDB: any,
  observationImages: Array<ObservationImage | undefined>
) => {
  try {
    // Upload feature images
    for (let i = 0; i < observationImages.length; i++) {
      // POST endpoint
      const observationImage: ObservationImage | undefined =
        observationImages[i];
      if (observationImage && observationImage.url) {
        const response = await api.postObservationImage(observationImage);

        if (!response.ok || !response.data?.result) {
          // Store offline
          if (
            response.problem === "cannot-connect" ||
            response.problem === "timeout"
          ) {
            await localDB.upsertEntities(
              [observationImage],
              EntityType.ObservationImage,
              false,
              null,
              null,
              observationImage.observationId
            );
          } else
            throw new ActionError(
              `Couldn't post/sync feature image: ${response.problem} ${response.originalError.message}`
            );
        } else {
          // Upsert if success
          await localDB.upsertEntities(
            [observationImage],
            EntityType.ObservationImage,
            true,
            null,
            null,
            observationImage.observationId
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const deleteMeasurement: Thunk =
  () =>
  async (dispatch, getState, { api, localDB, navigation }) => {
    // Delete Feature from backend
    const currentMeasurement: Measurement | undefined =
      getState().measurements.selectedMeasurementEntry;
    if (!currentMeasurement) return;
    const response = await api.deleteMeasurement(currentMeasurement);

    if (!response.ok) {
      throw new ActionError(
        `Couldn't delete measurement: ${response.problem} ${response.originalError.message}`
      );
    } else {
      // If success, delete from localDB
      const measurementId: string = currentMeasurement.id;

      const ids: Array<string> = [measurementId];
      if (ids.length > 0) await localDB.deleteEntities(ids);

      navigation.goBack();
      navigation.goBack(); // go back twice, to the observation details
      dispatch(fetchMeasurements({forceRefresh: true})); // and refresh so that the deleted measurement is gone
    }
  };
