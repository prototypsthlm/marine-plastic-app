import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Feature, FeatureImage, FeatureType } from "../../../models";
import { NewFeaturePayload } from "./types";

interface FeaturesState {
  // Pagination
  featureNextPageCursor: string | null;
  featureReachedPageEnd: boolean;

  // Entries
  featureEntries: Array<Feature>;
  featureImages: Array<FeatureImage>;
  featureTypes: Array<FeatureType>;

  // Selection
  selectedFeatureEntry?: Feature;

  // Form related
  featuresToAdd: Array<NewFeaturePayload>;
  selectedFeatureType?: FeatureType;
}

const initialState: FeaturesState = {
  // Pagination
  featureNextPageCursor: null,
  featureReachedPageEnd: false,

  // Entries
  featureEntries: [],
  featureImages: [],
  featureTypes: [],

  // Selection
  selectedFeatureEntry: undefined,

  // Form related
  featuresToAdd: [],
  selectedFeatureType: undefined,
};

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    // Pagination
    setFeatureCursor: (state, { payload }: PayloadAction<string | null>) => {
      state.featureReachedPageEnd = payload === null;
      state.featureNextPageCursor = payload;
    },
    setFeatureReachedPageEnd: (state, { payload }: PayloadAction<boolean>) => {
      state.featureReachedPageEnd = payload;
    },

    // Entries
    addFetchedFeatures: (state, { payload }: PayloadAction<Array<Feature>>) => {
      state.featureEntries = payload;
    },
    addFetchedFeatureImages: (
      state,
      { payload }: PayloadAction<Array<FeatureImage>>
    ) => {
      state.featureImages = payload;
    },
    addFetchedFeatureTypes: (
      state,
      { payload }: PayloadAction<Array<FeatureType>>
    ) => {
      state.featureTypes = payload;
    },

    // Selection
    selectFeature: (state, { payload }: PayloadAction<Feature>) => {
      state.selectedFeatureEntry = payload;
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
  // Pagination
  setFeatureCursor,
  setFeatureReachedPageEnd,

  // Entries
  addFetchedFeatures,
  addFetchedFeatureImages,
  addFetchedFeatureTypes,

  // Selection
  selectFeature,

  // Form related
  addNewFeatureToAdd,
  selectFeatureType,
  resetFeaturesToAdd,
  resetFeatureType,
} = featuresSlice.actions;

export default featuresSlice.reducer;
