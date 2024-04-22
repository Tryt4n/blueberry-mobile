import { ScrollView, TextInput, Alert, TouchableOpacity, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, signIn } from "@/api/auth/users";
import { useGlobalContext } from "../hooks/useGlobalContext";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";

export default function SignIn() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (loginForm.email === "" || loginForm.password === "") {
      return Alert.alert("Błąd", "Proszę uzupełnić wszystkie pola");
    }

    setIsSubmitting(true);

    try {
      await signIn(loginForm.email, loginForm.password);
      const result = await getCurrentUser();

      console.log(result);

      if (result) {
        setUser(result);
        setIsLoggedIn(true);
        // router.replace("/fertilizers");
        router.push("/fertilizers");
      }
    } catch (error: any) {
      Alert.alert("Error", "Nieprawidłowy email lub hasło. Spróbuj ponownie.");
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
            activeOpacity={0.7}
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
