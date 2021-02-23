import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Campaign } from "../../../models";

interface CampaignsState {
  // Pagination
  campaignNextPageCursor: string | null;
  campaignReachedPageEnd: boolean;

  // Entries
  campaignEntries: Array<Campaign>;

  // Selection
  selectedCampaignEntry?: Campaign;
}

const initialState: CampaignsState = {
  // Pagination
  campaignNextPageCursor: null,
  campaignReachedPageEnd: false,

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
      state.campaignReachedPageEnd = payload === null;
      state.campaignNextPageCursor = payload;
    },
    setCampaignReachedPageEnd: (state, { payload }: PayloadAction<boolean>) => {
      state.campaignReachedPageEnd = payload;
    },

    // Entries
    addFetchedCampaigns: (
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
  setCampaignReachedPageEnd,

  // Entries
  addFetchedCampaigns,

  // Selection
  selectCampaign,
  selectCampaignless,
} = campaignsSlice.actions;

export default campaignsSlice.reducer;
