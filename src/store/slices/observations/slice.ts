import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Observation, ObservationImage } from "../../../models";

interface ObservationsState {
  // Pagination
  nextPageCursor: string | null;
  isFirstPage: boolean;
  reachedPageEnd: boolean;
  refreshing: boolean;

  // Entries
  observationEntries: Array<Observation>;
  observationImages: Array<ObservationImage>;

  // Selection
  selectedObservationEntry?: Observation;
}

const initialState: ObservationsState = {
  // Pagination
  nextPageCursor: null,
  isFirstPage: true,
  reachedPageEnd: false,
  refreshing: false,

  // Entries
  observationEntries: [],
  observationImages: [],

  // Selection
  selectedObservationEntry: undefined,
};

export const observationsSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {
    // Pagination
    setObservationCursor: (
      state,
      { payload }: PayloadAction<string | null>
    ) => {
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
      state.observationEntries = [];
    },
    setRefreshing: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshing = payload;
    },

    // Entries
    addNewObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.observationEntries = [...state.observationEntries, payload];
    },
    addEditedObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.observationEntries = [
        ...state.observationEntries.filter(
          (observation) => observation.id !== payload.id
        ),
        payload,
      ];
    },
    addFetchedObservations: (
      state,
      { payload }: PayloadAction<Array<Observation>>
    ) => {
      if (state.isFirstPage) {
        state.isFirstPage = false;
        state.observationEntries = payload;
      } else {
        state.observationEntries = [...state.observationEntries, ...payload];
      }
    },
    addFetchedObservationImages: (
      state,
      { payload }: PayloadAction<Array<ObservationImage>>
    ) => {
      state.observationImages = payload;
    },
    setFetchedObservations: (
      state,
      { payload }: PayloadAction<Array<Observation>>
    ) => {
      state.observationEntries = payload;
    },

    // Selection
    selectObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.selectedObservationEntry = payload;
    },
  },
});

export const {
  // Pagination
  setObservationCursor,
  setReachedPageEnd,
  resetPagination,
  setRefreshing,

  // Entries
  addNewObservation,
  addEditedObservation,
  addFetchedObservations,
  addFetchedObservationImages,
  setFetchedObservations,

  // Selection
  selectObservation,
} = observationsSlice.actions;

export default observationsSlice.reducer;
