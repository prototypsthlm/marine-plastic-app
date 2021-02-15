import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Campaign, Feature, FeatureType, Observation } from "../../../models";
import { NewFeaturePayload } from "./types";

interface ObservationsState {
  campaignNextPageCursor: string | null;
  campaignReachedPageEnd: boolean;
  observationNextPageCursor: string | null;
  observationReachedPageEnd: boolean;

  campaignEntries: Array<Campaign>;
  observationEntries: Array<Observation>;
  featureTypes: Array<FeatureType>;

  selectedCampaignEntry?: Campaign;
  selectedObservationEntry?: Observation;
  selectedFeatureEntry?: Feature;

  // Form related
  featuresToAdd: Array<NewFeaturePayload>;
  selectedFeatureType?: FeatureType;
}

const initialState: ObservationsState = {
  campaignNextPageCursor: null,
  campaignReachedPageEnd: false,
  observationNextPageCursor: null,
  observationReachedPageEnd: false,

  campaignEntries: [],
  observationEntries: [],
  featureTypes: [],

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
    addNewObservation: (state, { payload }: PayloadAction<Observation>) => {
      state.observationEntries = [...state.observationEntries, payload];
    },
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
    addFetchedCampaigns: (
      state,
      {
        payload,
      }: PayloadAction<{ campaigns: Array<Campaign>; cursor: string | null }>
    ) => {
      state.campaignReachedPageEnd = payload.cursor === null;
      state.campaignNextPageCursor = payload.cursor;
      state.campaignEntries = [...state.campaignEntries, ...payload.campaigns];
    },
    addFetchedObservations: (
      state,
      { payload }: PayloadAction<Array<Observation>>
    ) => {
      state.observationEntries = payload;
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
  selectCampaign,
  selectCampaignless,
  selectObservation,
  selectFeature,
  addFetchedCampaigns,
  addFetchedObservations,
  setObservationCursor,
  setObservationReachedPageEnd,
  addFetchedFeatureTypes,
  addNewFeatureToAdd,
  selectFeatureType,
  resetFeaturesToAdd,
  resetFeatureType,
} = observationsSlice.actions;

export default observationsSlice.reducer;
