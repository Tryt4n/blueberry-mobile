import React from "react";
import { Tabs } from "expo-router";
import TabIcon from "@/components/TabIcon";

export default function FertigationTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          top: "5%",
          left: "10%",
          right: "10%",
          height: 60,
          borderRadius: 50,
        },
      }}
    >
      <Tabs.Screen
        name="fertilizers"
        options={{
          title: "Nawozy",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="leaf"
              color={color}
              name="Nawozy"
              focused={focused}
              gap={0}
              iconsSize={20}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="spraying"
        options={{
          title: "Opryski",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="leaf"
              color={color}
              name="Opryski"
              focused={focused}
              gap={0}
              iconsSize={20}
            />
          ),
        }}
      />
    </Tabs>
  );
}
