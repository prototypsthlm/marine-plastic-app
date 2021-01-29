import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Observation } from "./types";

interface ObservationsState {
  entries: Array<Observation>;
}

const initialState: ObservationsState = {
  entries: [],
};

export const observationsSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {
    addNewObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.entries = [...state.entries, payload];
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
  addFetchedObservations,
} = observationsSlice.actions;

export default observationsSlice.reducer;
