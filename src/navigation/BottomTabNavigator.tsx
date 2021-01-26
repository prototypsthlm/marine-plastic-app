import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import ObservationListScreen from "../screens/ObservationListScreen";
import ObservationMapScreen from "../screens/ObservationMapScreen";
import NewObservationScreen from "../screens/NewObservationScreen";

const BottomTab = createBottomTabNavigator<{
  ObservationList: undefined;
  ObservationMap: undefined;
  NewObservation: undefined;
}>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="ObservationList"
      tabBarOptions={{ activeTintColor: "#2f95dc" }}
    >
      <BottomTab.Screen
        name="ObservationList"
        component={ObservationListNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-list" color={color} />
          ),
          tabBarLabel: "List",
        }}
      />
      <BottomTab.Screen
        name="ObservationMap"
        component={ObservationMapNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-map" color={color} />
          ),
          tabBarLabel: "Map",
        }}
      />
      <BottomTab.Screen
        name="NewObservation"
        component={NewObservationNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-add-circle" color={color} />
          ),
          tabBarLabel: "Add",
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ObservationListStack = createStackNavigator<{
  ObservationListScreen: undefined;
}>();

function ObservationListNavigator() {
  return (
    <ObservationListStack.Navigator>
      <ObservationListStack.Screen
        name="ObservationListScreen"
        component={ObservationListScreen}
        options={{ headerTitle: "My observations list" }}
      />
    </ObservationListStack.Navigator>
  );
}

const ObservationMapStack = createStackNavigator<{
  ObservationMapScreen: undefined;
}>();

function ObservationMapNavigator() {
  return (
    <ObservationMapStack.Navigator>
      <ObservationMapStack.Screen
        name="ObservationMapScreen"
        component={ObservationMapScreen}
        options={{ headerTitle: "My observations map" }}
      />
    </ObservationMapStack.Navigator>
  );
}

const NewObservationStack = createStackNavigator<{
  NewObservationScreen: undefined;
}>();

function NewObservationNavigator() {
  return (
    <NewObservationStack.Navigator>
      <NewObservationStack.Screen
        name="NewObservationScreen"
        component={NewObservationScreen}
        options={{ headerTitle: "Add new observation" }}
      />
    </NewObservationStack.Navigator>
  );
}
