import * as React from "react";
import { Screen } from "../../../components/Screen";
import EditObservationForm from "../../../components/EditObservationForm";
import { NavigationProps } from "../../../navigation/types";
import { useSelector } from "react-redux";
import { Observation, User } from "../../../models";
import { RootState, useThunkDispatch } from "../../../store/store";
import { Section, Text, FlexColumn } from "../../../components/elements";
import { Alert } from "react-native";
import { deleteObservation } from "../../../store/slices/observations";
import DeleteButton from "../../../components/elements/DeleteButton";
import { theme } from "../../../theme";

export default function ObservationEditScreen({ navigation }: NavigationProps) {
  const dispatch = useThunkDispatch();

  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const username = `${user?.givenNames} ${user?.familyName}`;

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

  const belongsToCurrentUser =
    user && observationEntry && user.id === observationEntry.creatorId;


  if (!observationEntry) return null;

  const deleteAlert = () =>
    Alert.alert(
      "Delete observation?",
      "This observation will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => dispatch(deleteObservation()),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );


  return (
    <Screen scroll>
      <Section>
        <Text>
          <Text bold>Observer:</Text> {username}
        </Text>
        <Text>
          <Text bold>{"Date: "}</Text>
          {observationEntry.timestamp
            ? new Date(observationEntry.timestamp).toUTCString().slice(5, 17)
            : ""}
        </Text>
        <Text bold>Geolocation coords:</Text>
        {observationEntry.geometry?.coordinates.length > 0 ? (
          <FlexColumn>
            <Text>{observationEntry.geometry.coordinates[0]}</Text>
            <Text>{observationEntry.geometry.coordinates[1]}</Text>
          </FlexColumn>
        ) : null}
      </Section>
      <EditObservationForm navigation={navigation} />
      {belongsToCurrentUser && (
              <DeleteButton
                style={{
                  marginTop: theme.spacing.large,
                  marginBottom: theme.spacing.xxlarge,
                }}
                onPress={() => deleteAlert()}
              />
            )}
    </Screen>
  );
}
