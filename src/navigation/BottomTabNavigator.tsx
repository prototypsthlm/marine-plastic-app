import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from 'react-native';
import * as React from "react";

import ListNavigator from "./tabs/ListNavigator";
import MapNavigator from "./tabs/MapNavigator";
import AddNavigator from "./tabs/AddNavigator";
import { theme } from "../theme";

const BottomTab = createBottomTabNavigator();

const styles = StyleSheet.create({
  bottomTabLabel: {
    fontFamily: theme.typography.primary,
    fontSize: 12
  },
});
export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="observationList"
      screenOptions={{
        tabBarActiveTintColor: theme.color.palette.cyan, 
        tabBarInactiveTintColor: theme.color.palette.white,
        tabBarActiveBackgroundColor: theme.color.palette.gray,
        tabBarLabelStyle: styles.bottomTabLabel,
        headerShown: false
      }}
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
