import { ScrollView, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { getCurrentUser, signIn } from "@/api/auth/users";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

export default function SignInPage() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (loginForm.email === "" || loginForm.password === "") {
      return Alert.alert("Puste pola", "Wszystkie pola muszą być wypełnione.");
    }

    setIsSubmitting(true);

    try {
      await signIn(loginForm.email, loginForm.password);

      const result = await getCurrentUser();

      if (result) {
        setUser(result);
        setIsLoggedIn(true);

        router.replace("/");
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      Alert.alert(
        "Błąd logowania",
        "Nie udało się zalogować. Sprawdź czy wszystkie dane są wprowadzone poprawnie i spróbuj ponownie."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="px-4">
          <Text className="my-10 font-poppinsSemiBold text-2xl text-center">Zaloguj się</Text>

          <FormField
            title="Email:"
            placeholder="Uzupełnij email"
            keyboardType="email-address"
            handleChangeText={(e) => setLoginForm({ ...loginForm, email: e })}
          />

          <FormField
            title="Hasło:"
            placeholder="Uzupełnij hasło"
            secureTextEntry={true}
            handleChangeText={(e) => setLoginForm({ ...loginForm, password: e })}
          />

          <CustomButton
            text="Zaloguj się"
            disabled={isSubmitting}
            onPress={handleLogin}
            containerStyles="mt-5"
            textStyles="text-xl"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="font-poppinsRegular text-lg">
              Nie masz konta?&nbsp;
              <Link
                href="/signUp"
                className="font-poppinsSemiBold text-lg text-blue-500"
              >
                Zarejestruj się
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
