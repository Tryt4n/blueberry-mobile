import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import AuthAccountInfo from "@/components/AuthAccountInfo";

type AuthLayoutProps = {
  type: "signIn" | "signUp";
  children: React.ReactNode;
};

export default function AuthLayout({ type, children }: AuthLayoutProps) {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="px-4 pb-8">
          <Text className="my-10 font-poppinsSemiBold text-2xl text-center">
            {type === "signIn" ? "Zaloguj się" : "Zarejestruj się"}
          </Text>

          {children}

          <AuthAccountInfo href={`${type === "signIn" ? "/signUp" : "/signIn"}`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
