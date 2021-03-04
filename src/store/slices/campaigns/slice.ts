import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Campaign } from "../../../models";

interface CampaignsState {
  // Pagination
  nextPageCursor: string | null;
  isFirstPage: boolean;
  reachedPageEnd: boolean;
  refreshing: boolean;

  // Entries
  campaignEntries: Array<Campaign>;

  // Selection
  selectedCampaignEntry?: Campaign;
}

const initialState: CampaignsState = {
  // Pagination
  nextPageCursor: null,
  isFirstPage: true,
  reachedPageEnd: false,
  refreshing: false,

  // Entries
  campaignEntries: [],

  // Selection
  selectedCampaignEntry: undefined,
};

export const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    // Pagination
    setCampaignCursor: (state, { payload }: PayloadAction<string | null>) => {
      state.reachedPageEnd = payload === null;
      state.nextPageCursor = payload;
    },
    setreachedPageEnd: (state, { payload }: PayloadAction<boolean>) => {
      state.reachedPageEnd = payload;
    },
    resetPagination: (state) => {
      state.nextPageCursor = null;
      state.reachedPageEnd = false;
      state.isFirstPage = true;
      state.campaignEntries = [];
    },
    setRefreshing: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshing = payload;
    },

    // Entries
    addFetchedCampaigns: (
      state,
      { payload }: PayloadAction<Array<Campaign>>
    ) => {
      if (state.isFirstPage) {
        state.isFirstPage = false;
        state.campaignEntries = payload;
      } else {
        state.campaignEntries = [...state.campaignEntries, ...payload];
      }
    },
    setFetchedCampaigns: (
      state,
      { payload }: PayloadAction<Array<Campaign>>
    ) => {
      state.campaignEntries = payload;
    },

    // Selection
    selectCampaign: (state, { payload }: PayloadAction<Campaign>) => {
      state.selectedCampaignEntry = payload;
    },
    selectCampaignless: (state) => {
      state.selectedCampaignEntry = undefined;
    },
  },
});

export const {
  // Pagination
  setCampaignCursor,
  setreachedPageEnd,
  resetPagination,
  setRefreshing,

  // Entries
  addFetchedCampaigns,
  setFetchedCampaigns,

  // Selection
  selectCampaign,
  selectCampaignless,
} = campaignsSlice.actions;

export default campaignsSlice.reducer;
