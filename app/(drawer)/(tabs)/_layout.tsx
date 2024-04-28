import { Tabs } from "expo-router";
import React from "react";
import TabIcon from "@/components/TabIcon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: 84 },
      }}
    >
      <Tabs.Screen
        name="orders"
        options={{
          title: "Zamówienia",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="cart"
              color={color}
              name="Zamówienia"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(fertigation)"
        options={{
          title: "Fertygacja",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="leaf"
              color={color}
              name="Fertygacja"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="weather"
        options={{
          title: "Pogoda",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="sunny"
              color={color}
              name="Pogoda"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="management"
        options={{
          title: "Zarządzanie",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="wallet"
              color={color}
              name="Zarządzanie"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
