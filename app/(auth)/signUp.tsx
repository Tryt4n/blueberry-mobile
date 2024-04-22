import { ScrollView, TextInput, Alert, TouchableOpacity, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUser, getCurrentUser, signIn } from "@/api/auth/users";
import { useGlobalContext } from "../hooks/useGlobalContext";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";

export default function SignIn() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [loginForm, setLoginForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createAccount() {
    const { username, email, password, passwordConfirmation } = loginForm;

    if (username === "" || email === "" || password === "" || passwordConfirmation === "") {
      return Alert.alert("Błąd tworzenia konta", "Wszystkie pola są wymagane");
    }

    if (password !== passwordConfirmation) {
      return Alert.alert("Błąd tworzenia konta", "Hasła muszą być identyczne");
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(username, email, password);

      router.replace("/fertilizers");
    } catch (error) {
      return Alert.alert("Błąd", "Nie udało się utworzyć konta. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="px-4">
          <Text className="my-10 font-poppinsSemiBold text-2xl text-center">Zarejestruj się</Text>

          <FormField
            title="Nazwa użytkownika:"
            placeholder="Wprowadź swoją nazwę"
            handleChangeText={(e) => setLoginForm({ ...loginForm, username: e })}
          />

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

          <FormField
            title="Potwierdź hasło:"
            placeholder="Uzupełnij hasło ponownie"
            secureTextEntry={true}
            handleChangeText={(e) => setLoginForm({ ...loginForm, passwordConfirmation: e })}
          />

          <CustomButton
            text="Zarejestruj się"
            activeOpacity={0.7}
            disabled={isSubmitting}
            onPress={createAccount}
            containerStyles="mt-5"
            textStyles="text-xl"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="font-poppinsRegular text-lg">
              Masz już konto?&nbsp;
              <Link
                href="/signIn"
                className="font-poppinsSemiBold text-lg text-blue-500"
              >
                Zaloguj się
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
