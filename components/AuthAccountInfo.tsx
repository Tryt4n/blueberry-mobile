import { View, Text } from "react-native";
import { Link } from "expo-router";
import React from "react";

export default function AuthAccountInfo({ href }: { href: "/signIn" | "/signUp" }) {
  return (
    <View className="justify-center pt-5 flex-row gap-2">
      <Text className="font-poppinsRegular text-lg">
        {href === "/signIn" ? "Masz już konto? " : href === "/signUp" ? "Nie masz konta? " : ""}
        <Link
          href={href}
          className="font-poppinsSemiBold text-lg text-blue-500"
        >
          {href === "/signIn" ? "Zaloguj sie " : href === "/signUp" ? "Zarejestruj się " : ""}
        </Link>
      </Text>
    </View>
  );
}
