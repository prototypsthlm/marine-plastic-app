import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Campaign,
  Feature,
  FeatureImage,
  FeatureType,
  Observation,
} from "../../../models";
import { NewFeaturePayload } from "./types";

interface ObservationsState {
  // Pagination
  campaignNextPageCursor: string | null;
  campaignReachedPageEnd: boolean;
  observationNextPageCursor: string | null;
  observationReachedPageEnd: boolean;

  // Entries
  campaignEntries: Array<Campaign>;
  observationEntries: Array<Observation>;
  featureImages: Array<FeatureImage>;
  featureTypes: Array<FeatureType>;

  // Selection
  selectedCampaignEntry?: Campaign;
  selectedObservationEntry?: Observation;
  selectedFeatureEntry?: Feature;

  // Form related
  featuresToAdd: Array<NewFeaturePayload>;
  selectedFeatureType?: FeatureType;
}

const initialState: ObservationsState = {
  // Pagination
  campaignNextPageCursor: null,
  campaignReachedPageEnd: false,
  observationNextPageCursor: null,
  observationReachedPageEnd: false,

  // Entries
  campaignEntries: [],
  observationEntries: [],
  featureImages: [],
  featureTypes: [],

  // Selection
  selectedCampaignEntry: undefined,
  selectedObservationEntry: undefined,
  selectedFeatureEntry: undefined,

  // Form related
  featuresToAdd: [],
  selectedFeatureType: undefined,
};

export const observationsSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {
    // Pagination
    setCampaignCursor: (state, { payload }: PayloadAction<string | null>) => {
      state.campaignReachedPageEnd = payload === null;
      state.campaignNextPageCursor = payload;
    },
    setCampaignReachedPageEnd: (state, { payload }: PayloadAction<boolean>) => {
      state.campaignReachedPageEnd = payload;
    },
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
    addFetchedCampaigns: (
      state,
      { payload }: PayloadAction<Array<Campaign>>
    ) => {
      state.campaignEntries = payload;
    },
    addFetchedObservations: (
      state,
      { payload }: PayloadAction<Array<Observation>>
    ) => {
      state.observationEntries = payload;
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
    selectCampaign: (state, { payload }: PayloadAction<Campaign>) => {
      state.selectedCampaignEntry = payload;
    },
    selectCampaignless: (state) => {
      state.selectedCampaignEntry = undefined;
    },
    selectObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.selectedObservationEntry = payload;
    },
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
  setCampaignCursor,
  setCampaignReachedPageEnd,
  setObservationCursor,
  setObservationReachedPageEnd,

  // Entries
  addNewObservation,
  addFetchedCampaigns,
  addFetchedObservations,
  addFetchedFeatureImages,
  addFetchedFeatureTypes,

  // Selection
  selectCampaign,
  selectCampaignless,
  selectObservation,
  selectFeature,

  // Form related
  addNewFeatureToAdd,
  selectFeatureType,
  resetFeaturesToAdd,
  resetFeatureType,
} = observationsSlice.actions;

export default observationsSlice.reducer;
