import { Platform } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MenuProvider } from "react-native-popup-menu";
import { PaperProvider } from "react-native-paper";
import tw from "@/lib/twrnc";
import GlobalContextProvider from "../context/GlobalContext";
import ThemeContextProvider from "@/context/ThemeContext";
import BottomSheetTabsContextProvider from "@/context/BottomSheetTabsContext";
import OrderContextProvider from "@/context/OrdersContext";
import WeatherContextProvider from "@/context/WeatherContext";
import ModalContextProvider from "@/context/ModalContext";
import Modal from "@/components/Modal/Modal";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/lib/toast";

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

  // Google OAuth Provider Wrapper for web
  const GoogleOAuthProviderWrapper = ({ children }: { children: React.ReactNode }) => (
    <GoogleOAuthProvider clientId={process.env.EXPO_PUBLIC_WEB_OAUTH_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );

  // For other platforms return empty fragment
  const OtherWrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  const Wrapper = Platform.OS === "web" ? GoogleOAuthProviderWrapper : OtherWrapper;

  return (
    <Wrapper>
      <GestureHandlerRootView style={tw`flex-1 overflow-hidden`}>
        <GlobalContextProvider>
          <ThemeContextProvider>
            <OrderContextProvider>
              <WeatherContextProvider>
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

                        <Toast config={toastConfig} />
                        <Modal />
                      </ModalContextProvider>
                    </PaperProvider>
                  </MenuProvider>
                </BottomSheetTabsContextProvider>
              </WeatherContextProvider>
            </OrderContextProvider>
          </ThemeContextProvider>
        </GlobalContextProvider>
      </GestureHandlerRootView>
    </Wrapper>
  );
}
