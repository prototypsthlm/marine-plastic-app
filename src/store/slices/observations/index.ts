import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Observation } from "./types";

interface ObservationsState {
  observations: Array<Observation>;
}

const initialState: ObservationsState = {
  observations: [],
};

export const observationsSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {
    addNewObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.observations = [...state.observations, payload];
    },
  },
});

export const { addNewObservation } = observationsSlice.actions;

export default observationsSlice.reducer;
