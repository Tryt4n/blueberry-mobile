import { Button, Image, ScrollView, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "./hooks/useGlobalContext";
import { Link, router } from "expo-router";
import { signOut } from "@/api/auth/users";
import CustomButton from "@/components/CustomButton";

export default function App() {
  const { isLoading, isLoggedIn, user } = useGlobalContext();

  if (isLoggedIn) return null;

  // if (isLoading === false && isLoggedIn === false) return router.replace("/signIn");

  // if (!isLoading && isLoggedIn) return router.replace("/signIn");
  // if (!isLoading && !isLoggedIn) return router.replace("/signIn");

  if (isLoggedIn !== false) router.push("/fertilizers");

  return (
    <SafeAreaView>
      <ScrollView>
        {/* <StatusBar
          backgroundColor="#161622"
          style="light"
        /> */}

        <Text>Blueberry App</Text>

        <Link
          href={"/fertilizers"}
          className="p-4 bg-slate-500"
        >
          Go to fertilizers
        </Link>
        <Link
          href={"/(drawer)/(tabs)/fertilizers"}
          className="p-4 bg-red-300"
        >
          Go to fertilizers
        </Link>

        <CustomButton
          text="Wyloguj się"
          activeOpacity={0.7}
          // disabled={isLoading}
          onPress={signOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
