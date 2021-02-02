import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Observation } from "./types";

interface ObservationsState {
  entries: Array<Observation>;
  selectedEntry?: Observation;
}

const initialState: ObservationsState = {
  entries: [],
  selectedEntry: undefined,
};

export const observationsSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {
    addNewObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.entries = [...state.entries, payload];
    },
    selectObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.selectedEntry = payload;
    },
    addFetchedObservations: (
      state,
      { payload }: PayloadAction<Array<Observation>>
    ) => {
      state.entries = payload;
    },
  },
});

export const {
  addNewObservation,
  selectObservation,
  addFetchedObservations,
} = observationsSlice.actions;

export default observationsSlice.reducer;
