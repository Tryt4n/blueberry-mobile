import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import React, { type ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/build/Ionicons";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 84,
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
              />
            ),
          }}
        />

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
          name="weather"
          options={{
            title: "Pogoda",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="cloud"
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
    </>
  );
}

type TabIconProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  name: string;
  focused: boolean;
};

function TabIcon({ icon, color, name, focused }: TabIconProps) {
  return (
    <View className="items-center gap-2">
      <Ionicons
        name={icon}
        size={24}
        color={color}
        disabled={!focused}
      />

      <Text
        className={`${
          focused ? "font-poppinsSemiBold" : "font-poppinsRegular"
        } text-sm text-center`}
      >
        {name}
      </Text>
    </View>
  );
}
