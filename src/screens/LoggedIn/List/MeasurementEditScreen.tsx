import * as React from "react";
import { Screen } from "../../../components/Screen";
import EditFeatureForm from "../../../components/MeasurementForm/EditMeasurementForm";
import { NavigationProps } from "../../../navigation/types";


import { Alert } from "react-native";
import DeleteButton from "../../../components/elements/DeleteButton";
import { RootState, useThunkDispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { Measurement, User } from "../../../models";
import { deleteMeasurement } from "../../../store/slices/measurements";

export default function MeasurementEditScreen({ navigation }: NavigationProps) {

  const dispatch = useThunkDispatch();
  const user = useSelector<RootState, User | undefined>(
    (state) => state.account.user
  );
  const deleteAlert = () =>
  Alert.alert(
    "Delete measurement?",
    "This measurement will be permanently deleted.",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => dispatch(deleteMeasurement()),
        style: "destructive",
      },
    ],
    { cancelable: false }
  );

  const measurementEntry = useSelector<RootState, Measurement | undefined>(
    (state) => state.measurements.selectedMeasurementEntry
  );


  const belongsToCurrentUser =
    user && measurementEntry && user.id === measurementEntry.creatorId;

  return (
    <Screen scroll>
      <EditFeatureForm navigation={navigation} />
      {belongsToCurrentUser && (
        <DeleteButton onPress={() => deleteAlert()} />
      )}
    </Screen>
  );
}
