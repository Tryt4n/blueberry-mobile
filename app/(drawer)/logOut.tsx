import { View, Text, Alert, ScrollView } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { signOut } from "@/api/auth/appwrite";
import { signOutWithGoogle } from "@/api/auth/google";
import CustomButton from "@/components/CustomButton";

export default function LogOutPage() {
  const { isLoggedIn, setIsLoggedIn, setUser, authProvider, setAuthProvider } = useGlobalContext();
  const { setEditedOrder, setIsBannerVisible, setOrdersData, setOrdersSearchParams } =
    useOrdersContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logOut() {
    if (!isLoggedIn) return;

    setIsSubmitting(true);

    try {
      authProvider === "google" ? signOutWithGoogle() : await signOut();

      // Reset all app states
      setUser(null);
      setIsLoggedIn(false);

      setOrdersData(null);
      setEditedOrder(null);
      setOrdersSearchParams({ startDate: undefined, endDate: undefined, userId: undefined });
      setIsBannerVisible(false);

      // Reset provider
      setAuthProvider("appwrite");

      router.replace("/signIn");
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się wylogować. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <View>
        <Text className="font-poppinsSemiBold text-2xl text-center mb-4">Wylogować się?</Text>
        <View className="flex flex-row justify-between gap-4 h-">
          <CustomButton
            text="Tak"
            onPress={logOut}
            disabled={isSubmitting}
            containerStyles="bg-transparent border-2 border-blue-500 px-8 h-16"
            textStyles="text-black"
            loading={isSubmitting}
            loadingColor="rgb(59 130 246)"
          />

          <CustomButton
            text="Nie"
            containerStyles="px-8 h-16"
            disabled={isSubmitting}
            onPress={() => router.back()}
          />
        </View>
      </View>
    </ScrollView>
  );
}
