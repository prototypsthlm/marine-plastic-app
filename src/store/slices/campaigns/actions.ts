import { Campaign } from "../../../models";
import { Thunk } from "../../store";
import {
  addFetchedCampaigns,
  resetPagination,
  selectCampaign,
  selectCampaignless,
  setCampaignCursor,
  setFetchedCampaigns,
  setRefreshing,
} from "./slice";
import { ActionError } from "../../errors/ActionError";
import { EntityType } from "../../../services/localDB/types";
import { fetchObservations, setReachedPageEnd } from "../observations";

export const fetchCampaigns: Thunk<{ forceRefresh?: boolean }> = (
  options
) => async (dispatch, getState, { api, localDB }) => {
  dispatch(setRefreshing(true));
  const { forceRefresh } = options;
  const refresh: boolean = forceRefresh || false;
  if (
    (refresh || !getState().campaigns.reachedPageEnd) &&
    getState().ui.isOnline
  ) {
    if (refresh && getState().campaigns.reachedPageEnd)
      dispatch(resetPagination());
    // 1. Get next page
    const result = await api.getCampaigns(getState().campaigns.nextPageCursor);
    if (!result.ok || !result.data?.results)
      throw new ActionError("Couldn't get/sync campaigns.");

    const campaigns: Array<Campaign> = result.data.results;
    const cursor: string | null = result.data?.nextPage;

    // 2. Upsert to localDB
    if (campaigns.length > 0)
      await localDB.upsertEntities(campaigns, EntityType.Campaign, true);

    dispatch(setCampaignCursor(cursor));
    dispatch(addFetchedCampaigns(campaigns));
  }

  if (!getState().ui.isOnline) {
    dispatch(fetchCachedCampaigns());
  }
  dispatch(setRefreshing(false));
};

export const fetchCachedCampaigns: Thunk = () => async (
  dispatch,
  _,
  { localDB }
) => {
  try {
    const campaignEntries: Array<Campaign> = await localDB.getEntities<Campaign>(
      EntityType.Campaign
    );
    dispatch(setFetchedCampaigns(campaignEntries));
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
  dispatch(setReachedPageEnd(false));
  dispatch(fetchObservations({}));
  navigation.goBack();
};
