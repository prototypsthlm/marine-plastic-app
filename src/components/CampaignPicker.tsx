import * as React from "react";
import { useSelector } from "react-redux";
import { Campaign } from "../models";
import {
  fetchCampaigns,
  setSelectedCampaign,
} from "../store/slices/observations";
import { RootState, useThunkDispatch } from "../store/store";
import { theme } from "../theme";
import { ListItem, SectionHeader, Text, FlexColumn } from "./elements";
import { FlatList } from "react-native";

export default function CampaignPicker() {
  const dispatch = useThunkDispatch();

  const campaignEntries = useSelector<RootState, Array<Campaign>>(
    (state) => state.observations.campaignEntries
  );

  const campaignlessEntry: Campaign = {
    id: "campaignless",
    creatorId: "EMPTY",
    name: "Campaign-less observations",
    environmentalCompartments: ["SEAFLOOR", "FLOATING"],
    tSort: "2023-07-27T03:59:42.924Z",
    keywords: [],
    isClosed: false,
  };

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

  return (
    <FlatList
      data={[campaignlessEntry, ...campaignEntries]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => <SectionHeader>SELECT CAMPAIGN</SectionHeader>}
      onEndReached={() => {
        // dispatch(fetchCampaigns());
        console.log("fetch on end reach");
      }}
      onEndReachedThreshold={0.1}
    />
  );
}
