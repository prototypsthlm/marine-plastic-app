import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import ObservationListScreen from "../screens/ObservationListScreen";
import ObservationMapScreen from "../screens/ObservationMapScreen";
import NewObservationScreen from "../screens/NewObservationScreen";
import ObservationDetailScreen from "../screens/ObservationDetailScreen";
import NewFeatureScreen from "../screens/NewFeatureScreen";
import FeatureDetailScreen from "../screens/FeatureDetailScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="observationList"
      tabBarOptions={{ activeTintColor: "#2f95dc" }}
    >
      <BottomTab.Screen
        name="observationList"
        component={ObservationListNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-list" color={color} />
          ),
          tabBarLabel: "List",
        }}
      />
      <BottomTab.Screen
        name="observationMap"
        component={ObservationMapNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-map" color={color} />
          ),
          tabBarLabel: "Map",
        }}
      />
      <BottomTab.Screen
        name="newObservation"
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
const Stack = createStackNavigator();

function ObservationListNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="observationListScreen"
        component={ObservationListScreen}
        options={{ headerTitle: "My observations list" }}
      />
      <Stack.Screen
        name="observationDetailScreen"
        component={ObservationDetailScreen}
        options={{ headerTitle: "Observations details" }}
      />
      <Stack.Screen
        name="featureDetailScreen"
        component={FeatureDetailScreen}
        options={{ headerTitle: "Feature details" }}
      />
    </Stack.Navigator>
  );
}

function ObservationMapNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="observationMapScreen"
        component={ObservationMapScreen}
        options={{ headerTitle: "My observations map" }}
      />
    </Stack.Navigator>
  );
}

function NewObservationNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="newObservationScreen"
        component={NewObservationScreen}
        options={{ headerTitle: "Add new observation" }}
      />
      <Stack.Screen
        name="newFeatureScreen"
        component={NewFeatureScreen}
        options={{ headerTitle: "Add new feature" }}
      />
    </Stack.Navigator>
  );
}
