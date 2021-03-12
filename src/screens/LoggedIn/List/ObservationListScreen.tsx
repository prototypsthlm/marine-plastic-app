import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import { Campaign, FeatureImage, Observation, User } from "../../../models";

import { FlatList, Image, View } from "react-native";

import { Screen } from "../../../components/Screen";
import {
  fetchObservations,
  selectFilteredObservationsByCampaign,
  selectObservationDetails,
} from "../../../store/slices/observations";
import {
  //fetchCachedFeatureImages,
  fetchAllLitterTypes
} from "../../../store/slices/measurements";
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

  /*
  const featureImages = useSelector<RootState, Array<FeatureImage>>(
    (state) => state.measurments.featureImages
  );
  */

  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const username = `${user?.givenNames} ${user?.familyName}`;

  useEffect(() => {
    dispatch(fetchAllLitterTypes());
    //dispatch(fetchCachedFeatureImages());
    dispatch(fetchObservations({}));
  }, []);

  const navigateToDetailScreen = (observationEntry: Observation) => {
    dispatch(selectObservationDetails(observationEntry));
    navigation.navigate("observationDetailScreen");
  };

  /*
  const getFeatureImage = (featureId: string) =>
    featureImages.find((f) => f.featureId === featureId);
  */

  const renderItem = ({ item }: { item: Observation }) => (
    <ListItem style={{}}onPress={() => navigateToDetailScreen(item)}>
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 12,
        backgroundColor: "#efefef",
      }} />
      <FlexColumn>
        { user?.id === item.creatorId ? (
          <Text style={{ fontFamily: theme.typography.primaryBold, color: theme.color.palette.curiousBlue }}>{username}</Text>
          
        ): (
          <Text style={{ color: theme.color.palette.gray}}>Observer</Text>
        )}
        <Text>
          {item.timestamp
            ? new Date(item.timestamp).toUTCString().slice(5, 17)
            : ""}
        </Text>
      </FlexColumn>
    </ListItem>
  );

  const refreshingObservationList = useSelector<RootState, boolean>(
    (state) => state.observations.refreshing
  );

  return (
    <Screen>
      <FlatList
        refreshing={refreshingObservationList}
        onRefresh={() => dispatch(fetchObservations({ forceRefresh: true }))}
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
        onEndReached={() => dispatch(fetchObservations({}))}
        onEndReachedThreshold={0.1}
      />
    </Screen>
  );
}
