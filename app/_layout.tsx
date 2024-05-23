import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { PaperProvider } from "react-native-paper";
import tw from "@/lib/twrnc";
import GlobalContextProvider from "../context/GlobalContext";
import BottomSheetTabsContextProvider from "@/context/BottomSheetTabsContext";
import OrderContextProvider from "@/context/OrdersContext";
import Toast from "react-native-toast-message";
import ModalContextProvider from "@/context/ModalContext";
import Modal from "@/components/Modal/Modal";

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
    <GestureHandlerRootView style={tw`flex-1 overflow-hidden`}>
      <GlobalContextProvider>
        <OrderContextProvider>
          <BottomSheetTabsContextProvider>
            <MenuProvider>
              <PaperProvider theme={{ dark: false }}>
                <ModalContextProvider>
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
                  <Modal />
                </ModalContextProvider>
              </PaperProvider>
            </MenuProvider>
          </BottomSheetTabsContextProvider>
        </OrderContextProvider>
      </GlobalContextProvider>
    </GestureHandlerRootView>
  );
}
