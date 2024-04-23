import { ScrollView, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { createUser } from "@/api/auth/users";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

export default function SignUpPage() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [signInForm, setSignInForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createAccount() {
    if (
      signInForm.username === "" ||
      signInForm.email === "" ||
      signInForm.password === "" ||
      signInForm.passwordConfirmation === ""
    ) {
      return Alert.alert("Puste pola", "Wszystkie pola muszą być wypełnione.");
    }
    if (signInForm.password !== signInForm.passwordConfirmation) {
      return Alert.alert("Niezgodność haseł", "Hasła muszą być identyczne.");
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(signInForm.email, signInForm.password, signInForm.username);

      if (result) {
        setUser(result);
        setIsLoggedIn(true);

        router.replace("/");
      } else {
        throw new Error("Error with creating account.");
      }
    } catch (error) {
      Alert.alert("Błąd rejestracji", "Nie udało się utworzyć konta. Spróbuj ponownie.");
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
            handleChangeText={(e) => setSignInForm({ ...signInForm, username: e })}
          />

          <FormField
            title="Email:"
            placeholder="Uzupełnij email"
            keyboardType="email-address"
            handleChangeText={(e) => setSignInForm({ ...signInForm, email: e })}
          />

          <FormField
            title="Hasło:"
            placeholder="Uzupełnij hasło"
            secureTextEntry={true}
            handleChangeText={(e) => setSignInForm({ ...signInForm, password: e })}
          />

          <FormField
            title="Potwierdź hasło:"
            placeholder="Uzupełnij hasło ponownie"
            secureTextEntry={true}
            handleChangeText={(e) => setSignInForm({ ...signInForm, passwordConfirmation: e })}
          />

          <CustomButton
            text="Zarejestruj się"
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
