import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Campaign } from "../models";
import { clearCacheCampaignsIfOnline, fetchCampaigns, setSelectedCampaign } from "../store/slices/campaigns";
import { RootState, useThunkDispatch } from "../store/store";
import { theme } from "../theme";
import { ListItem, SectionHeader, Text, FlexColumn } from "./elements";
import { FlatList } from "react-native";

export default function CampaignPicker() {
  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(clearCacheCampaignsIfOnline())
  }, []);

  const campaignEntries = useSelector<RootState, Array<Campaign>>(
    (state) => state.campaigns.campaignEntries
  );

  const campaignlessEntry: Campaign = {
    id: "campaignless",
    creatorId: "EMPTY",
    name: "Campaign-less observations",
    environmentalCompartments: [],
    tSort: "",
    keywords: [],
    isClosed: false,
  };

  const openedCampaignEntries = campaignEntries.filter((c) => !c.isClosed);

  const renderItem = ({ item }: { item: Campaign }) => (
    <ListItem
      onPress={() =>
        dispatch(
          setSelectedCampaign({
            campaignEntryPayload: item,
            isCampignless: item.id === "campaignless",
          })
        )
      }
    >
      <FlexColumn style={{ width: "100%" }}>
        <Text style={{ paddingVertical: theme.spacing.small }}>
          {item.name}
        </Text>
      </FlexColumn>
    </ListItem>
  );

  const refreshingCampaignsList = useSelector<RootState, boolean>(
    (state) => state.campaigns.refreshing
  );

  return (
    <FlatList
      refreshing={refreshingCampaignsList}
      onRefresh={() => dispatch(fetchCampaigns({ forceRefresh: true }))}
      data={[campaignlessEntry, ...openedCampaignEntries]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => <SectionHeader>SELECT CAMPAIGN</SectionHeader>}
      onEndReached={() => dispatch(fetchCampaigns({}))}
      onEndReachedThreshold={0.1}
    />
  );
}
