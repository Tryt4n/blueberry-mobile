import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { Drawer as SideMenu } from "expo-router/drawer";
import { Text, Image } from "react-native";
import React, { type ComponentProps } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { Redirect, router, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import OrderBottomSheet from "@/components/OrderBottomSheet/OrderBottomSheet";

export default function DrawerLayout() {
  const { isLoggedIn } = useGlobalContext();

  if (!isLoggedIn) return <Redirect href="/signIn" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SideMenu
        screenOptions={{
          headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
          headerTitleAlign: "center",
          drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 16,
          },
          drawerAllowFontScaling: true,
          drawerPosition: "right", // Places the drawer on the right side of the screen
          headerLeft: () => null, // Removes hamburger button from the header on the left side
          headerRight: () => <DrawerToggleButton />, // Adds hamburger button with the functionality of opening the menu
        }}
        drawerContent={CustomDrawerContent}
      >
        <SideMenu.Screen
          name="(tabs)"
          options={{
            title: "",
            drawerLabel: "Główna",
            drawerIcon: ({ color, size }) => (
              <Ionicons
                name="home-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <SideMenu.Screen
          name="settings"
          options={{
            title: "Ustawienia",
            drawerIcon: ({ color, size }) => (
              <Ionicons
                name="settings-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <SideMenu.Screen
          name="logOut"
          options={{
            title: "Wyloguj się",
            drawerIcon: ({ color, size }) => (
              <Ionicons
                name="log-out-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </SideMenu>

      <OrderBottomSheet />
    </GestureHandlerRootView>
  );
}

function CustomDrawerContent(props: ComponentProps<typeof DrawerItemList>) {
  const { user } = useGlobalContext();
  const pathname = usePathname();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView>
        {user && (
          <TouchableOpacity
            activeOpacity={0.7}
            className="mx-auto mb-8 items-center"
            disabled={pathname === "/settings"}
            onPress={() => {
              router.push("/settings");
            }}
          >
            <Image
              source={{ uri: user.avatar }}
              className="w-24 h-24 rounded-full items-center flex justify-center align-middle"
            />
            <Text className="pt-2 text-xl font-poppinsBold text-center">{user.username}</Text>
          </TouchableOpacity>
        )}

        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}
