import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Observation } from "../../../models";

interface ObservationsState {
  // Pagination
  observationNextPageCursor: string | null;
  observationReachedPageEnd: boolean;

  // Entries
  observationEntries: Array<Observation>;

  // Selection
  selectedObservationEntry?: Observation;
}

const initialState: ObservationsState = {
  // Pagination
  observationNextPageCursor: null,
  observationReachedPageEnd: false,

  // Entries
  observationEntries: [],

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
      state.observationReachedPageEnd = payload === null;
      state.observationNextPageCursor = payload;
    },
    setObservationReachedPageEnd: (
      state,
      { payload }: PayloadAction<boolean>
    ) => {
      state.observationReachedPageEnd = payload;
    },

    // Entries
    addNewObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.observationEntries = [...state.observationEntries, payload];
    },
    addFetchedObservations: (
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
  setObservationReachedPageEnd,

  // Entries
  addNewObservation,
  addFetchedObservations,

  // Selection
  selectObservation,
} = observationsSlice.actions;

export default observationsSlice.reducer;
