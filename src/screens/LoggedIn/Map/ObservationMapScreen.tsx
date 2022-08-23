import React, { useCallback, useEffect, useRef, useState } from "react";
import WebView from "react-native-webview"
import styled from "../../../styled";
import MapView, { Callout, Geojson, Marker } from "react-native-maps";
import { Dimensions, View, Image, Platform } from "react-native";
import { useSelector } from "react-redux";
import { RootState, useThunkDispatch } from "../../../store/store";
import { Geometry, Observation, User } from "../../../models";
import { theme } from "../../../theme";
import { NavigationProps } from "../../../navigation/types";
import { fetchObservationCreator, selectObservationDetails } from "../../../store/slices/observations";
import { getLatLng, isValidMapPoint } from "../../../utils/geoUtils";

const getPoint = (observation: Observation) : Array<number> => {
  if (observation.geometry.type === 'Point') return observation.geometry.coordinates as Array<number>
  else if (observation.geometry.type === 'LineString') return observation.geometry.coordinates[0] as Array<number>
  else if (observation.geometry.type === 'Polygon') return observation.geometry.coordinates[0][0] as Array<number>
}

export default function ObservationMapScreen({navigation}: NavigationProps) {

  const dispatch = useThunkDispatch();

  const [selectedObservation, setSelectedObservation]: any = useState(null);

  const user = useSelector<RootState, User | undefined>(
      (state) => state.account.user,
  );

  const observationsEntries = useSelector<RootState, Array<Observation>>(
      (state) => state.observations.observationEntries,
  );

  const observationUsers = useSelector<RootState, Array<User>>(
      (state) => state.observations.observationUsers,
  )

  const handleOnPinPress = async (index: number) => {

    if (!observationUsers.find(u => u.id === observationsEntries[index].creatorId) && observationsEntries[index].creatorId !== user?.id) {
      dispatch(fetchObservationCreator({creatorId: observationsEntries[index].creatorId}));
    }

    setSelectedObservation(observationsEntries[index]);
  }

  const handleOnCalloutPress = () => {
    dispatch(selectObservationDetails(selectedObservation));
    navigation.navigate("observationDetailScreen");
  }

  const getCreatorName = (observation: Observation) => {

    const isCreator = (observation.creatorId === user?.id);
    const fetchedCreator = observationUsers.find(u => u.id === observation.creatorId);

    if (isCreator) return `${user?.givenNames} ${user?.familyName}`

    if (fetchedCreator)
      return fetchedCreator ? `${fetchedCreator.givenNames} ${fetchedCreator.familyName}` : "unknown";
    else {
      return "Observer";
    }
  }

  const renderObservationDetails = useCallback((observationEntry: Observation) => {

    const imageUrl = observationEntry.images && observationEntry.images.length > 0 ? observationEntry.images[0].url : undefined;
    const creatorName = getCreatorName(observationEntry);

    return <>
      {imageUrl && (
          Platform.select(
              {
                ios:
                    <CalloutImage resizeMode={"cover"} source={{uri: imageUrl}}/>,
                android:
                // Using a workaround: https://github.com/react-native-maps/react-native-maps/issues/2633#issuecomment-686165281
                    <CalloutImageWrapper>
                      <WebView
                          style={{height: 50, width: 50}}
                          originWhitelist={[imageUrl]}
                          source={{
                            html:
                                `<img src="${imageUrl}" style="width: 250px; height: 250px;" />`,
                          }}/>
                    </CalloutImageWrapper>,
              })
      )}
      <View style={{flexDirection: "column"}}>
        <Title>Observer: {creatorName}</Title>
        <Text>{"Date: "}
          {observationEntry.timestamp
              ? new Date(observationEntry.timestamp)
                  .toUTCString()
                  .slice(5, 17)
              : ""}
        </Text>
        {observationEntry.comments != null && observationEntry.comments !== "" ? (
            <Text style={{maxWidth: 100}}>
              {observationEntry.comments}
            </Text>
        ) : <Text>No comment</Text>}
      </View>
    </>
  }, [observationUsers]);

  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef && mapRef.current) {
      const map : MapView = mapRef.current as MapView
      map.fitToElements()
    }
  }, [observationsEntries])

  return (
      <Screen>
        <MapView
            ref={mapRef}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
        >
          {observationsEntries.map((observationEntry, index) => {
            if (observationEntry.geometry.type) {
              return <Marker
                  key={index}
                  coordinate={getLatLng(getPoint(observationEntry))}
                  onPress={() => handleOnPinPress(index)}
                  onCalloutPress={handleOnCalloutPress}
                  pinColor={theme.color.palette.cyan}
              >
                <Callout>
                  <CustomCallOutView>
                    {renderObservationDetails(observationEntry)}
                  </CustomCallOutView>
                </Callout>
              </Marker>
            } else return null;
          })}
        </MapView>
      </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;


const CalloutImageWrapper = styled.View`
  height: 50px;
  width: 50px;
  position: relative;
  margin-right: ${theme.spacing.small}px;
`

const CalloutImage = styled.Image`
  height: 50px;
  width: 50px;
`;

const CustomCallOutView = styled.View`
  display: flex;
  flex-direction: row;
`;

const MarkerPopup = styled.View`
  border-radius: 6px;
  background-color: white;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.typography.primaryBold};
  font-size: ${(props) => props.theme.fontSize.tiny}px;
`;

const Text = styled.Text`
  font-family: ${(props) => props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.tiny}px;
`;
