import { createSelector } from "@reduxjs/toolkit";
import { Observation } from "../../../models";
import { RootState } from "../../store";

const selectCurrentCampaign = (state: RootState) =>
  state.campaigns.selectedCampaignEntry;

const selectObservationEntries = (state: RootState) =>
  state.observations.observationEntries;

export const selectFilteredObservationsByCampaign = createSelector(
  selectCurrentCampaign,
  selectObservationEntries,
  (selectedCampaign, observationEntries): Array<Observation> =>
    observationEntries
      .filter(
        (observationEntry) =>
          observationEntry.campaignId === (selectedCampaign?.id || null)
      )
      .reverse()
);
