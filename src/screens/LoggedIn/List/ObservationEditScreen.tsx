import * as React from "react";
import { Screen } from "../../../components/Screen";
import EditObservationForm from "../../../components/EditObservationForm";
import { NavigationProps } from "../../../navigation/types";
import { useSelector } from "react-redux";
import { Observation, User } from "../../../models";
import { RootState } from "../../../store/store";
import { Section, Text, FlexColumn } from "../../../components/elements";

export default function ObservationEditScreen({ navigation }: NavigationProps) {
  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );

  const username = `${user?.givenNames} ${user?.familyName}`;

  const observationEntry = useSelector<RootState, Observation | undefined>(
    (state) => state.observations.selectedObservationEntry
  );

  if (!observationEntry) return null;

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
    </Screen>
  );
}
