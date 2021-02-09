import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Feature, FeatureType, Observation } from "../../../models";
import { NewFeaturePayload } from "./types";

interface ObservationsState {
  entries: Array<Observation>;
  selectedEntry?: Observation;
  selectedFeatureEntry?: Feature;
  featureTypes: Array<FeatureType>;

  // Form related
  featuresToAdd: Array<NewFeaturePayload>;
  selectedFeatureType?: FeatureType;
}

const initialState: ObservationsState = {
  entries: [],
  selectedEntry: undefined,
  selectedFeatureEntry: undefined,
  featureTypes: [],

  // Form related
  featuresToAdd: [],
  selectedFeatureType: undefined,
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
    addFetchedFeatureTypes: (
      state,
      { payload }: PayloadAction<Array<FeatureType>>
    ) => {
      state.featureTypes = payload;
    },

    // Form related
    addNewFeatureToAdd: (
      state,
      { payload }: PayloadAction<NewFeaturePayload>
    ) => {
      state.featuresToAdd = [...state.featuresToAdd, payload];
    },
    selectFeatureType: (state, { payload }: PayloadAction<FeatureType>) => {
      state.selectedFeatureType = payload;
    },
    resetFeaturesToAdd: (state) => {
      state.featuresToAdd = [];
    },
    resetFeatureType: (state) => {
      state.selectedFeatureType = undefined;
    },
  },
});

export const {
  addNewObservation,
  selectObservation,
  selectFeature,
  addFetchedObservations,
  addFetchedFeatureTypes,
  addNewFeatureToAdd,
  selectFeatureType,
  resetFeaturesToAdd,
  resetFeatureType,
} = observationsSlice.actions;

export default observationsSlice.reducer;
