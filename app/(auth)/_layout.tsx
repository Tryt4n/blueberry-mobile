import { Redirect, Stack } from "expo-router";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AuthLayout() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const { colors } = useThemeContext();

  if (isLoading) return <LoadingSpinner />;

  if (isLoggedIn) return <Redirect href="/" />;

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.bgAccent } }}>
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
