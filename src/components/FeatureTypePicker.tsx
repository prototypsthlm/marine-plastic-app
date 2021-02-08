import * as React from "react";
import { useSelector } from "react-redux";
import { FeatureType } from "../models";
import { RootState } from "../store/store";
import styled from "../styled";
import { theme } from "../theme";
import { ListItem, SectionHeader, Text, FlexColumn, FlexRow } from "./elements";

export default function FeatureTypePicker() {
  const featureTypes = useSelector<RootState, Array<FeatureType>>(
    (state) => state.observations.featureTypes
  );

  return (
    <>
      <SectionHeader>FILTER BY...</SectionHeader>
      <ListItem>
        <Text
          style={{
            color: theme.color.palette.gray,
            paddingTop: theme.spacing.small,
            paddingBottom: theme.spacing.small,
          }}
        >
          Material
        </Text>
      </ListItem>
      <ListItem>
        <Text
          style={{
            color: theme.color.palette.gray,
            paddingTop: theme.spacing.small,
            paddingBottom: theme.spacing.small,
          }}
        >
          Env. compartments
        </Text>
      </ListItem>

      <SectionHeader style={{ marginTop: theme.spacing.large }}>
        SELECT FEATURE TYPE
      </SectionHeader>

      {!(featureTypes.length > 0) && (
        <ListItem style={{ justifyContent: "center" }}>
          <CenteredGrayText>
            There aren't any items matching this criteria.
          </CenteredGrayText>
        </ListItem>
      )}

      {featureTypes.map((featureType, index) => (
        <ListItem key={index}>
          <FlexColumn style={{ width: "100%" }}>
            <FlexRow>
              <Text bold>{featureType.tsgMlCode}</Text>
              <Text style={{ color: theme.color.palette.gray }}>
                {featureType.material}
              </Text>
            </FlexRow>
            <Text>{featureType.name}</Text>
          </FlexColumn>
        </ListItem>
      ))}
    </>
  );
}

const CenteredGrayText = styled.Text`
  margin: ${(props) => props.theme.spacing.medium}px;
  color: ${(props) => props.theme.color.palette.gray};
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;
