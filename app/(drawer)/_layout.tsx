import { TouchableOpacity } from "react-native-gesture-handler";
import { Drawer as SideMenu } from "expo-router/drawer";
import { Text, Image } from "react-native";
import React, { type ComponentProps } from "react";
import tw from "@/lib/twrnc";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { Redirect, router, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { avatarImages } from "@/constants/avatars";
import { Ionicons } from "@expo/vector-icons";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DrawerLayout() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoading) return <LoadingSpinner />;

  if (!isLoading && !isLoggedIn) return <Redirect href="/signIn" />;

  return (
    <>
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
    </>
  );
}

function CustomDrawerContent(props: ComponentProps<typeof DrawerItemList>) {
  const { user, platform } = useGlobalContext();
  const pathname = usePathname();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView>
        {user && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={tw`mx-auto mb-8 items-center${platform === "web" ? " mt-8" : ""}`}
            disabled={pathname === "/settings"}
            onPress={() => {
              router.push("/settings");
            }}
          >
            <Image
              source={
                !isNaN(Number(user.avatar))
                  ? avatarImages[Number(user.avatar) - 1]
                  : { uri: user.avatar }
              }
              style={tw`w-24 h-24 rounded-full items-center flex justify-center`}
            />
            <Text style={tw`pt-2 text-xl font-poppinsBold text-center`}>{user.username}</Text>
          </TouchableOpacity>
        )}

        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}
