import React, { useEffect } from "react";
import styled from "../../styled";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../store/store";
import { Campaign, Observation } from "../../models";

import { Image } from "react-native";

import { Screen } from "../../components/Screen";
import {
  fetchAllCampaigns,
  fetchAllFeatureTypes,
  fetchAllObservations,
  selectFilteredObservationsByCampaign,
  selectObservation,
} from "../../store/slices/observations";
import { NavigationProps } from "../../navigation/types";
import {
  FlexColumn,
  ListItem,
  SectionHeader,
  Text,
} from "../../components/elements";
import { theme } from "../../theme";

export default function ObservationListScreen({ navigation }: NavigationProps) {
  const dispatch = useThunkDispatch();

  const observationsEntries = useSelector(selectFilteredObservationsByCampaign);

  const selectedCampaignEntry = useSelector<RootState, Campaign | undefined>(
    (state) => state.observations.selectedCampaignEntry
  );

  useEffect(() => {
    dispatch(fetchAllFeatureTypes());
    dispatch(fetchAllCampaigns());
    dispatch(fetchAllObservations());
  }, []);

  const navigateToDetailScreen = (observationEntry: Observation) => {
    dispatch(selectObservation(observationEntry));
    navigation.navigate("observationDetailScreen");
  };

  return (
    <Screen scroll>
      <SectionHeader>SELECTED CAMPAIGN</SectionHeader>
      <ListItem onPress={() => navigation.navigate("campaignPickerScreen")}>
        <Text
          style={{
            color: theme.color.palette.gray,
            paddingVertical: theme.spacing.small,
          }}
        >
          {selectedCampaignEntry
            ? selectedCampaignEntry.name
            : "Campaign-less observations"}
        </Text>
      </ListItem>

      <SectionHeader style={{ marginTop: theme.spacing.large }}>
        OBSERVATIONS
      </SectionHeader>

      {!(observationsEntries.length > 0) && (
        <ListItem>
          <Text
            style={{
              color: theme.color.palette.gray,
              paddingVertical: theme.spacing.small,
            }}
          >
            There is still no observation added in this campaign.
          </Text>
        </ListItem>
      )}

      {observationsEntries.map((observationEntry, index) => (
        <ListItem
          key={index}
          onPress={() => navigateToDetailScreen(observationEntry)}
        >
          {observationEntry.features.length > 0 ? (
            <Image
              source={{ uri: observationEntry.features[0].imageUrl }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 6,
                marginRight: 12,
              }}
            />
          ) : null}
          <FlexColumn>
            <Text>John Smith</Text>
            <Text>
              {observationEntry.timestamp
                ? new Date(observationEntry.timestamp)
                    .toUTCString()
                    .slice(5, 17)
                : ""}
            </Text>
          </FlexColumn>
        </ListItem>
      ))}
    </Screen>
  );
}
