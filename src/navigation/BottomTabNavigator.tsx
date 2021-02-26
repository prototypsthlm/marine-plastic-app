import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import ListNavigator from "./tabs/ListNavigator";
import MapNavigator from "./tabs/MapNavigator";
import AddNavigator from "./tabs/AddNavigator";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="observationList"
      tabBarOptions={{ activeTintColor: "#2f95dc" }}
    >
      <BottomTab.Screen
        name="observationList"
        component={ListNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-list" color={color} />
          ),
          tabBarLabel: "List",
        }}
      />
      <BottomTab.Screen
        name="observationMap"
        component={MapNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-map" color={color} />
          ),
          tabBarLabel: "Map",
        }}
      />
      <BottomTab.Screen
        name="newObservation"
        component={AddNavigator}
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
