import { Observation } from "../../../models";
import { RootState } from "../../store";

export const selectFilteredObservationsByCampaign = (
  state: RootState
): Array<Observation> => {
  const selecedCampaignId: string | null =
    state.campaigns.selectedCampaignEntry?.id || null;
  return state.observations.observationEntries
    .filter(
      (observationEntry) => observationEntry.campaignId === selecedCampaignId
    )
    .reverse();
};
