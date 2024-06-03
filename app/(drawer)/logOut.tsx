import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { signOut as AppwriteAuthLogout } from "@/api/auth/appwrite";
import tw from "@/lib/twrnc";
import CustomButton from "@/components/CustomButton";

export default function LogOutPage() {
  const { isLoggedIn, setIsLoggedIn, setUser } = useGlobalContext();
  const { theme, colors } = useThemeContext();
  const { setModalData, showModal } = useModalContext();
  const { setEditedOrder, setIsBannerVisible, setOrdersData, setOrdersSearchParams } =
    useOrdersContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logOut() {
    if (!isLoggedIn) return;

    setIsSubmitting(true);

    try {
      await AppwriteAuthLogout();

      // Reset all app states
      setUser(null);
      setIsLoggedIn(false);

      setOrdersData(null);
      setEditedOrder(null);
      setOrdersSearchParams({ startDate: undefined, endDate: undefined, userId: undefined });
      setIsBannerVisible(false);
      setModalData({ title: "true" });

      router.replace("/signIn");
    } catch (error) {
      setModalData({
        title: "Błąd",
        subtitle: "Nie udało się wylogować. Spróbuj ponownie.",
        btn1: { text: "Ok" },
      });
      showModal();
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
        <Text style={tw`font-poppinsSemiBold text-2xl text-center mb-4 text-[${colors.text}]`}>
          Wylogować się?
        </Text>

        <View style={tw`flex flex-row justify-between gap-4`}>
          <CustomButton
            text="Tak"
            onPress={logOut}
            disabled={isSubmitting}
            containerStyles={`bg-transparent border-2 border-[${colors.primary}] px-8 h-16`}
            textStyles={`text-[${colors.primary}]`}
            loading={isSubmitting}
            loadingColor={colors.primary}
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
