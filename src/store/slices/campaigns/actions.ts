import { Campaign } from "../../../models";
import { Thunk } from "../../store";
import {
  addFetchedCampaigns,
  selectCampaign,
  selectCampaignless,
  setCampaignCursor,
} from "./slice";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";
import {
  fetchObservations,
  setObservationReachedPageEnd,
} from "../observations";

export const fetchCampaigns: Thunk = () => async (
  dispatch,
  getState,
  { api, localDB }
) => {
  if (!getState().campaigns.campaignReachedPageEnd && getState().ui.isOnline) {
    // 1. Get next page
    const result = await api.getCampaigns(
      getState().campaigns.campaignNextPageCursor
    );
    if (!result.ok || !result.data?.results)
      throw new ActionError("Couldn't get/sync campaigns.");

    const campaigns: Array<Campaign> = result.data.results;
    const cursor: string | null = result.data?.nextPage;

    // 2. Upsert to localDB
    if (campaigns.length > 0)
      await localDB.upsertEntities(campaigns, EntityType.Campaign, true);

    dispatch(setCampaignCursor(cursor));
  }

  dispatch(fetchAllCampaigns());
};

export const fetchAllCampaigns: Thunk = () => async (
  dispatch,
  _,
  { localDB }
) => {
  try {
    const campaignEntries: Array<Campaign> = await localDB.getEntities<Campaign>(
      EntityType.Campaign
    );
    dispatch(addFetchedCampaigns(campaignEntries));
  } catch (e) {
    console.log({ e });
  }
};

export const setSelectedCampaign: Thunk<{
  campaignEntryPayload?: Campaign;
  isCampignless?: boolean;
}> = ({ campaignEntryPayload, isCampignless = false }) => (
  dispatch,
  _,
  { navigation }
) => {
  if (isCampignless) dispatch(selectCampaignless());
  else if (campaignEntryPayload) dispatch(selectCampaign(campaignEntryPayload));
  dispatch(setObservationReachedPageEnd(false));
  dispatch(fetchObservations());
  navigation.goBack();
};
