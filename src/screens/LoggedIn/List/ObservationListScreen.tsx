import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import { Campaign, Observation, ObservationImage, User } from "../../../models";

import { FlatList, Image, View } from "react-native";

import { Screen } from "../../../components/Screen";
import {
  fetchCachedObservationImages,
  fetchObservations,
  selectFilteredObservationsByCampaign,
  selectObservationDetails,
} from "../../../store/slices/observations";
import {
  fetchAllLitterTypes,
  fetchAllMaterials,
} from "../../../store/slices/measurements";
import { NavigationProps } from "../../../navigation/types";
import {
  FlexColumn,
  ListItem,
  SectionHeader,
  Text,
} from "../../../components/elements";
import { theme } from "../../../theme";
import { Ionicons } from "@expo/vector-icons";

export default function ObservationListScreen({ navigation }: NavigationProps) {
  const dispatch = useThunkDispatch();

  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );

  const observationsEntries = useSelector(selectFilteredObservationsByCampaign);

  const selectedCampaignEntry = useSelector<RootState, Campaign | undefined>(
    (state) => state.campaigns.selectedCampaignEntry
  );

  const observationImages = useSelector<RootState, Array<ObservationImage>>(
    (state) => state.observations.observationImages
  );

  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const username = `${user?.givenNames} ${user?.familyName}`;

  useEffect(() => {
    dispatch(fetchAllLitterTypes());
    dispatch(fetchAllMaterials());
    dispatch(fetchCachedObservationImages());
    dispatch(fetchObservations({}));
  }, []);

  const navigateToDetailScreen = (observationEntry: Observation) => {
    dispatch(selectObservationDetails(observationEntry));
    navigation.navigate("observationDetailScreen");
  };

  const getObservationImage = (observation: Observation) => {
    let image;

    if (isOnline && observation.images && observation.images?.length > 0) {
      image = observation.images[0];
    } else {
      image = observationImages.find((f) => f.observationId === observation.id);
    }

    return image?.url || "";
  };

  const renderItem = ({ item }: { item: Observation }) => (
    <ListItem style={{}} onPress={() => navigateToDetailScreen(item)}>
      {getObservationImage(item) ? (
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 6,
            marginRight: 12,
          }}
          source={{ uri: getObservationImage(item) }}
        />
      ) : (
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 6,
            marginRight: 12,
            backgroundColor: "#efefef",
          }}
        />
      )}

      <FlexColumn>
        {user?.id === item.creatorId ? (
          <Text
            style={{
              fontFamily: theme.typography.primaryBold,
              color: theme.color.palette.curiousBlue,
            }}
          >
            {username}
          </Text>
        ) : (
          <Text style={{ color: theme.color.palette.gray }}>Observer</Text>
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
              <Ionicons
                size={20}
                style={{
                  color: theme.color.palette.curiousBlue,
                  marginLeft: "auto",
                  marginRight: 5,
                }}
                name="chevron-down"
              />
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
