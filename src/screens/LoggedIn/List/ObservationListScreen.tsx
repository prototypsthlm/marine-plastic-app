import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import { Campaign, FeatureImage, Observation, User } from "../../../models";

import { FlatList, Image } from "react-native";

import { Screen } from "../../../components/Screen";
import {
  fetchObservations,
  selectFilteredObservationsByCampaign,
  selectObservationDetails,
} from "../../../store/slices/observations";
import {
  fetchCachedFeatureImages,
  fetchAllFeatureTypes,
} from "../../../store/slices/features";
import { NavigationProps } from "../../../navigation/types";
import {
  FlexColumn,
  ListItem,
  SectionHeader,
  Text,
} from "../../../components/elements";
import { theme } from "../../../theme";

export default function ObservationListScreen({ navigation }: NavigationProps) {
  const dispatch = useThunkDispatch();

  const observationsEntries = useSelector(selectFilteredObservationsByCampaign);

  const selectedCampaignEntry = useSelector<RootState, Campaign | undefined>(
    (state) => state.campaigns.selectedCampaignEntry
  );

  const featureImages = useSelector<RootState, Array<FeatureImage>>(
    (state) => state.features.featureImages
  );

  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const username = `${user?.givenNames} ${user?.familyName}`;

  useEffect(() => {
    dispatch(fetchAllFeatureTypes());
    dispatch(fetchCachedFeatureImages());
    dispatch(fetchObservations());
  }, []);

  const navigateToDetailScreen = (observationEntry: Observation) => {
    dispatch(selectObservationDetails(observationEntry));
    navigation.navigate("observationDetailScreen");
  };

  const getFeatureImage = (featureId: string) =>
    featureImages.find((f) => f.featureId === featureId);

  const renderItem = ({ item }: { item: Observation }) => (
    <ListItem onPress={() => navigateToDetailScreen(item)}>
      {item.features &&
      item.features.length > 0 &&
      getFeatureImage(item.features[0].id) ? (
        <Image
          source={{ uri: getFeatureImage(item.features[0].id)?.url }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 6,
            marginRight: 12,
          }}
        />
      ) : null}
      <FlexColumn>
        <Text>{username}</Text>
        <Text>
          {item.timestamp
            ? new Date(item.timestamp).toUTCString().slice(5, 17)
            : ""}
        </Text>
      </FlexColumn>
    </ListItem>
  );

  return (
    <Screen>
      <FlatList
        data={observationsEntries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            <SectionHeader>SELECTED CAMPAIGN</SectionHeader>
            <ListItem
              onPress={() => navigation.navigate("campaignPickerScreen")}
            >
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
          </>
        )}
        onEndReached={() => dispatch(fetchObservations())}
        onEndReachedThreshold={0.1}
      />
    </Screen>
  );
}
