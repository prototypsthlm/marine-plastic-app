import {
  NavigationContainerRef,
  NavigationState,
  PartialState,
  StackActions,
} from "@react-navigation/native";
import React from "react";

export const navigationRef = React.createRef<NavigationContainerRef>();

export const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

export const replace = (name: string, params?: any) => {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
};

export const resetRoot = (
  state?: PartialState<NavigationState> | NavigationState
) => {
  navigationRef.current?.resetRoot(state);
};

export const getRotState = () => navigationRef.current?.getRootState();

export const goBack = () => {
  navigationRef.current?.goBack();
};
