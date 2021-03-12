import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FeatureImage, LitterType, Measurement } from "../../../models";
import { NewMeasurementPayload } from "./types";

interface MeasurementsState {
  // Pagination
  nextPageCursor: string | null;
  isFirstPage: boolean;
  reachedPageEnd: boolean;
  refreshing: boolean;

  // Entries
  measurementEntries: Array<Measurement>;
  //featureImages: Array<FeatureImage>;
  litterTypes: Array<LitterType>;

  // Selection
  selectedMeasurementEntry?: Measurement;

  // Form related
  measurementsToAdd: Array<NewMeasurementPayload>;
  selectedLitterType?: LitterType;
}

const initialState: MeasurementsState = {
  // Pagination
  nextPageCursor: null,
  isFirstPage: true,
  reachedPageEnd: false,
  refreshing: false,

  // Entries
  measurementEntries: [],
  //featureImages: [],
  litterTypes: [],

  // Selection
  selectedMeasurementEntry: undefined,

  // Form related
  measurementsToAdd: [],
  selectedLitterType: undefined,
};

export const measurementsSlice = createSlice({
  name: "measurements",
  initialState,
  reducers: {
    // Pagination
    setMeasurementCursor: (state, { payload }: PayloadAction<string | null>) => {
      state.reachedPageEnd = payload === null;
      state.nextPageCursor = payload;
    },
    setReachedPageEnd: (state, { payload }: PayloadAction<boolean>) => {
      state.reachedPageEnd = payload;
    },
    resetPagination: (state) => {
      state.nextPageCursor = null;
      state.reachedPageEnd = false;
      state.isFirstPage = true;
      state.measurementEntries = [];
    },
    setRefreshing: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshing = payload;
    },

    // Entries
    addEditedMeasurement: (state, { payload }: PayloadAction<Measurement>) => {
      state.measurementEntries = [
        ...state.measurementEntries.filter((measurement) => measurement.id !== payload.id),
        payload,
      ];
    },
    addFetchedMeasurements: (state, { payload }: PayloadAction<Array<Measurement>>) => {
      if (state.isFirstPage) {
        state.isFirstPage = false;
        state.measurementEntries = payload;
      } else {
        state.measurementEntries = [...state.measurementEntries, ...payload];
      }
    },
    setFetchedMeasurements: (state, { payload }: PayloadAction<Array<Measurement>>) => {
      state.measurementEntries = payload;
    },
    /*
    addFetchedFeatureImages: (
      state,
      { payload }: PayloadAction<Array<FeatureImage>>
    ) => {
      state.featureImages = payload;
    },
    */
    addFetchedLitterTypes: (
      state,
      { payload }: PayloadAction<Array<LitterType>>
    ) => {
      state.litterTypes = payload;
    },

    // Selection
    selectMeasurement: (state, { payload }: PayloadAction<Measurement>) => {
      state.selectedMeasurementEntry = payload;
    },

    // Form related
    addNewMeasurementToAdd: (
      state,
      { payload }: PayloadAction<NewMeasurementPayload>
    ) => {
      state.measurementsToAdd = [...state.measurementsToAdd, payload];
    },
    selectLitterType: (state, { payload }: PayloadAction<LitterType>) => {
      state.selectedLitterType = payload;
    },
    resetMeasurementsToAdd: (state) => {
      state.measurementsToAdd = [];
    },
    resetLitterType: (state) => {
      state.selectedLitterType = undefined;
    },
  },
});

export const {
  // Pagination
  setMeasurementCursor,
  setReachedPageEnd,
  resetPagination,
  setRefreshing,

  // Entries
  addEditedMeasurement,
  addFetchedMeasurements,
  setFetchedMeasurements,
  //addFetchedFeatureImages,
  addFetchedLitterTypes,

  // Selection
  selectMeasurement,

  // Form related
  addNewMeasurementToAdd,
  selectLitterType,
  resetMeasurementsToAdd,
  resetLitterType,
} = measurementsSlice.actions;

export default measurementsSlice.reducer;
