import { Observation } from "../../../models";
import { RootState } from "../../store";

const aggregateAndSelectKey = (array: Array<any>, key: string): Array<string> =>
  array.reduce(
    (acc, val) =>
      acc.includes(val[key]) && val[key] !== null ? acc : [...acc, val[key]],
    []
  );

export const selectFeatureTypeByMaterial = (
  state: RootState
): Array<string> => {
  return aggregateAndSelectKey(state.observations.featureTypes, "material");
};

export const selectFilteredObservationsByCampaign = (
  state: RootState
): Array<Observation> => {
  const selecedCampaignId: string | null =
    state.observations.selectedCampaignEntry?.id || null;
  return state.observations.observationEntries
    .filter(
      (observationEntry) => observationEntry.campaignId === selecedCampaignId
    )
    .reverse();
};
