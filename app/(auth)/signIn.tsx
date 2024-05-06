import { Alert } from "react-native";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useOnSubmitEditing } from "@/hooks/useOnSubmitEditing";
import { getCurrentUser, signIn } from "@/api/auth/appwrite";
import AuthLayout from "@/layout/AuthLayout";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import CustomButton from "@/components/CustomButton";
import { FormField } from "@/components/FormField";
import type { TextInput } from "react-native-gesture-handler";

export default function SignInPage() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialErrorsState = {
    email: null,
    password: null,
  };
  const [errors, setErrors] =
    useState<Record<keyof typeof loginForm, string[] | null>>(initialErrorsState);

  const loginRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  async function handleLogin() {
    if (loginForm.email === "" || loginForm.password === "") {
      return Alert.alert("Puste pola", "Wszystkie pola muszą być wypełnione.");
    }

    setIsSubmitting(true);

    try {
      setErrors(initialErrorsState);
      const { session, errors } = await signIn(loginForm.email, loginForm.password);

      if (session) {
        const result = await getCurrentUser();

        if (result) {
          setUser(result);
          setIsLoggedIn(true);

          router.replace("/");
        } else {
          throw new Error("User not found");
        }
      } else {
        setErrors(errors);
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
    <AuthLayout type="signIn">
      <GoogleSignInButton setIsSubmitting={setIsSubmitting} />

      <FormField
        ref={loginRef}
        title="Email:"
        placeholder="Uzupełnij email"
        keyboardType="email-address"
        errors={errors.email}
        handleChangeText={(e) => setLoginForm({ ...loginForm, email: e })}
        onSubmitEditing={useOnSubmitEditing(isSubmitting, loginForm, passwordRef, handleLogin)}
      />

      <FormField
        ref={passwordRef}
        title="Hasło:"
        placeholder="Uzupełnij hasło"
        secureTextEntry={true}
        errors={errors.password}
        handleChangeText={(e) => setLoginForm({ ...loginForm, password: e })}
        onSubmitEditing={useOnSubmitEditing(isSubmitting, loginForm, loginRef, handleLogin)}
      />

      <CustomButton
        text="Zaloguj się"
        disabled={isSubmitting}
        onPress={handleLogin}
        containerStyles="mt-5"
        textStyles="text-xl"
        loading={isSubmitting}
      />
    </AuthLayout>
  );
}
