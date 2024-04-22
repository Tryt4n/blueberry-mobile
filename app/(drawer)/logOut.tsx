import { View, Text } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { signOut } from "@/api/auth/users";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function Profile() {
  function logOut() {
    //! Check first if user is logged in
    signOut();

    router.replace("/signIn");
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
              activeOpacity={0.7}
              onPress={logOut}
              containerStyles="bg-transparent border-2 border-blue-500 px-8"
              textStyles="text-black"
            />

            <CustomButton
              text="Nie"
              activeOpacity={0.7}
              containerStyles="px-8"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
