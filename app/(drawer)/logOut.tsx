import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { signOut } from "@/api/auth/appwrite";
import CustomButton from "@/components/CustomButton";
import { signOutWithGoogle } from "@/api/auth/google";

export default function LogOutPage() {
  const { isLoggedIn, setIsLoggedIn, setUser, authProvider } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logOut() {
    if (!isLoggedIn) return;

    setIsSubmitting(true);

    try {
      authProvider === "google" ? signOutWithGoogle() : await signOut();

      setUser(null);
      setIsLoggedIn(false);

      router.replace("/signIn");
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się wylogować. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{ alignItems: "center", justifyContent: "center", height: "100%" }}
      >
        <View>
          <Text className="font-poppinsSemiBold text-2xl text-center mb-4">Wylogować się?</Text>
          <View className="flex flex-row justify-between gap-4">
            <CustomButton
              text="Tak"
              onPress={logOut}
              disabled={isSubmitting}
              containerStyles="bg-transparent border-2 border-blue-500 px-8"
              textStyles="text-black"
              loading={isSubmitting}
              loadingColor="rgb(59 130 246)"
            />

            <CustomButton
              text="Nie"
              containerStyles="px-8"
              disabled={isSubmitting}
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
