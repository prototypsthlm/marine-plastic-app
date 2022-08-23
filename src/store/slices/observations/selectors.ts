import { createSelector } from "@reduxjs/toolkit";
import { Observation } from "../../../models";
import { RootState } from "../../store";

const selectCurrentCampaign = (state: RootState) =>
  state.campaigns.selectedCampaignEntry;

const selectObservationEntries = (state: RootState) =>
  state.observations.observationEntries;

const currentUser = (state: RootState) =>
  state.account.user;

export const selectFilteredObservationsByCampaign = createSelector(
  selectCurrentCampaign,
  selectObservationEntries,
  currentUser,
  (selectedCampaign, observationEntries, currentUser): Array<Observation> =>
    observationEntries.filter(
      (observationEntry) =>
      selectedCampaign?.id? observationEntry.campaignId === selectedCampaign.id :
      (observationEntry.campaignId === null && observationEntry.creatorId === currentUser?.id)
    )
);
