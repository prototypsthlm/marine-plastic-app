import * as React from "react";
import { useSelector } from "react-redux";
import { Campaign } from "../models";
import { setSelectedCampaign } from "../store/slices/observations";
import { RootState, useThunkDispatch } from "../store/store";
import { theme } from "../theme";
import { ListItem, SectionHeader, Text, FlexColumn } from "./elements";

export default function CampaignPicker() {
  const dispatch = useThunkDispatch();

  const campaignsEntries = useSelector<RootState, Array<Campaign>>(
    (state) => state.observations.campaignsEntries
  );

  return (
    <>
      <SectionHeader>SELECT CAMPAIGN</SectionHeader>

      <ListItem
        onPress={() => dispatch(setSelectedCampaign({ isCampignless: true }))}
      >
        <FlexColumn style={{ width: "100%" }}>
          <Text style={{ paddingVertical: theme.spacing.small }}>
            Campaign-less observations
          </Text>
        </FlexColumn>
      </ListItem>

      {campaignsEntries.map((campaignEntry, index) => (
        <ListItem
          key={index}
          onPress={() =>
            dispatch(
              setSelectedCampaign({ campaignEntryPayload: campaignEntry })
            )
          }
        >
          <FlexColumn style={{ width: "100%" }}>
            <Text style={{ paddingVertical: theme.spacing.small }}>
              {campaignEntry.name}
            </Text>
          </FlexColumn>
        </ListItem>
      ))}
    </>
  );
}
