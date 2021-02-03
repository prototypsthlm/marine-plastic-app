import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Observation } from "../../../models";
import { NewFeaturePayload } from "./types";

interface ObservationsState {
  entries: Array<Observation>;
  selectedEntry?: Observation;

  // Form related
  featuresToAdd: Array<NewFeaturePayload>;

  error?: any;
}

const initialState: ObservationsState = {
  entries: [],
  selectedEntry: undefined,

  // Form related
  featuresToAdd: [],
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

    // Form related
    addNewFeatureToAdd: (
      state,
      { payload }: PayloadAction<NewFeaturePayload>
    ) => {
      state.featuresToAdd = [...state.featuresToAdd, payload];
    },
    resetFeaturesToAdd: (state) => {
      state.featuresToAdd = [];
    },

    displayError: (state, { payload }: PayloadAction<any>) => {
      state.error = payload;
    },
  },
});

export const {
  addNewObservation,
  selectObservation,
  addFetchedObservations,
  addNewFeatureToAdd,
  resetFeaturesToAdd,
  displayError,
} = observationsSlice.actions;

export default observationsSlice.reducer;
