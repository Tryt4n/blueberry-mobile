import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="signIn"
        options={{
          title: "Zaloguj się",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="signUp"
        options={{
          title: "Zaloguj się",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
