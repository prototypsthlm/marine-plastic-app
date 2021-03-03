import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Feature, FeatureImage, FeatureType } from "../../../models";
import { NewFeaturePayload } from "./types";

interface FeaturesState {
  // Pagination
  nextPageCursor: string | null;
  isFirstPage: boolean;
  reachedPageEnd: boolean;
  refreshing: boolean;

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
  nextPageCursor: null,
  isFirstPage: true,
  reachedPageEnd: false,
  refreshing: false,

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
      state.featureEntries = [];
    },
    setRefreshing: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshing = payload;
    },

    // Entries
    addEditedFeature: (state, { payload }: PayloadAction<Feature>) => {
      state.featureEntries = [
        ...state.featureEntries.filter((feature) => feature.id !== payload.id),
        payload,
      ];
    },
    addFetchedFeatures: (state, { payload }: PayloadAction<Array<Feature>>) => {
      if (state.isFirstPage) {
        state.isFirstPage = false;
        state.featureEntries = [...state.featureEntries, ...payload];
      } else {
        state.featureEntries = payload;
      }
    },
    setFetchedFeatures: (state, { payload }: PayloadAction<Array<Feature>>) => {
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
  setReachedPageEnd,
  resetPagination,
  setRefreshing,

  // Entries
  addEditedFeature,
  addFetchedFeatures,
  setFetchedFeatures,
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
