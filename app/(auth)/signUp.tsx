import { ScrollView, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { createUser } from "@/api/auth/users";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import type { ErrorKeys } from "@/types/Errors";

export default function SignUpPage() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [signInForm, setSignInForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<ErrorKeys, string[] | null>>({
    email: null,
    username: null,
    password: null,
    passwordConfirmation: null,
    alert: null,
  });

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
      const result = await createUser(
        signInForm.email,
        signInForm.password,
        signInForm.username,
        signInForm.passwordConfirmation
      );

      if (result.user) {
        setUser(result.user);
        setIsLoggedIn(true);

        router.replace("/");
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      Alert.alert("Błąd rejestracji", "Nie udało się utworzyć konta. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // async function createAccount() {
  //   if (
  //     signInForm.username === "" ||
  //     signInForm.email === "" ||
  //     signInForm.password === "" ||
  //     signInForm.passwordConfirmation === ""
  //   ) {
  //     return Alert.alert("Puste pola", "Wszystkie pola muszą być wypełnione.");
  //   }
  //   if (signInForm.password !== signInForm.passwordConfirmation) {
  //     return Alert.alert("Niezgodność haseł", "Hasła muszą być identyczne.");
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     const result = await createUser(signInForm.email, signInForm.password, signInForm.username);

  //     if (result) {
  //       setUser(result);
  //       setIsLoggedIn(true);

  //       router.replace("/");
  //     } else {
  //       throw new Error("Error with creating account.");
  //     }
  //   } catch (error) {
  //     Alert.alert("Błąd rejestracji", "Nie udało się utworzyć konta. Spróbuj ponownie.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }

  if (errors.alert && errors.alert.length > 0) {
    Alert.alert("Błąd rejestracji", errors.alert.join("\n"));
    setErrors({ ...errors, alert: [] });
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
          {errors.username && errors.username.length > 0 && (
            <View>
              {errors.username.map((error, index) => (
                <Text
                  key={index}
                  className="text-red-500 text-sm"
                >
                  {error}
                </Text>
              ))}
            </View>
          )}

          <FormField
            title="Email:"
            placeholder="Uzupełnij email"
            keyboardType="email-address"
            handleChangeText={(e) => setSignInForm({ ...signInForm, email: e })}
          />
          {errors.email && errors.email.length > 0 && (
            <View>
              {errors.email.map((error, index) => (
                <Text
                  key={index}
                  className="text-red-500 text-sm"
                >
                  {error}
                </Text>
              ))}
            </View>
          )}

          <FormField
            title="Hasło:"
            placeholder="Uzupełnij hasło"
            secureTextEntry={true}
            handleChangeText={(e) => setSignInForm({ ...signInForm, password: e })}
          />
          {errors.password && errors.password.length > 0 && (
            <View>
              {errors.password.map((error, index) => (
                <Text
                  key={index}
                  className="text-red-500 text-sm"
                >
                  {error}
                </Text>
              ))}
            </View>
          )}

          <FormField
            title="Potwierdź hasło:"
            placeholder="Uzupełnij hasło ponownie"
            secureTextEntry={true}
            handleChangeText={(e) => setSignInForm({ ...signInForm, passwordConfirmation: e })}
          />
          {errors.passwordConfirmation && errors.passwordConfirmation.length > 0 && (
            <View>
              {errors.passwordConfirmation.map((error, index) => (
                <Text
                  key={index}
                  className="text-red-500 text-sm"
                >
                  {error}
                </Text>
              ))}
            </View>
          )}

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
