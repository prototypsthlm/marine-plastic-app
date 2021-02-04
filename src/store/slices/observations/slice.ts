import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Feature, Observation } from "../../../models";
import { NewFeaturePayload } from "./types";

interface ObservationsState {
  entries: Array<Observation>;
  selectedEntry?: Observation;
  selectedFeatureEntry?: Feature;

  // Form related
  featuresToAdd: Array<NewFeaturePayload>;
}

const initialState: ObservationsState = {
  entries: [],
  selectedEntry: undefined,
  selectedFeatureEntry: undefined,

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
    selectFeature: (state, { payload }: PayloadAction<Feature>) => {
      state.selectedFeatureEntry = payload;
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
  },
});

export const {
  addNewObservation,
  selectObservation,
  selectFeature,
  addFetchedObservations,
  addNewFeatureToAdd,
  resetFeaturesToAdd,
} = observationsSlice.actions;

export default observationsSlice.reducer;
