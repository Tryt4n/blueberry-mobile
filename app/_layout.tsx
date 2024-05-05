import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalContextProvider from "../context/GlobalContext";
import BottomSheetTabsContextProvider from "@/context/BottomSheetTabsContext";
import OrderContextProvider from "@/context/OrdersContext";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalContextProvider>
        <OrderContextProvider>
          <BottomSheetTabsContextProvider>
            <StatusBar />

            <Stack>
              <Stack.Screen
                name="index"
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="(auth)"
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="(drawer)"
                options={{ headerShown: false }}
              />
            </Stack>

            <Toast />
          </BottomSheetTabsContextProvider>
        </OrderContextProvider>
      </GlobalContextProvider>
    </GestureHandlerRootView>
  );
}
