import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOnSubmitEditing } from "@/hooks/useOnSubmitEditing";
import { getCurrentUser, signIn } from "@/api/auth/appwrite";
import AuthLayout from "@/layout/AuthLayout";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import CustomButton from "@/components/CustomButton";
import { FormField } from "@/components/FormField";
import type { TextInput } from "react-native-gesture-handler";

export default function SignInPage() {
  const { setUser, setIsLoggedIn, platform } = useGlobalContext();
  const { setModalData, showModal } = useModalContext();

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
      setModalData({
        title: "Puste pola",
        subtitle: "Wszystkie pola muszą być wypełnione.",
        btn1: { text: "Ok" },
      });
      showModal();
      return;
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
      setModalData({
        title: "Błąd logowania",
        subtitle:
          "Nie udało się zalogować. Sprawdź czy wszystkie dane są wprowadzone poprawnie i spróbuj ponownie.",
        btn1: { text: "Ok" },
      });
      showModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout type="signIn">
      {platform !== "web" && <GoogleSignInButton setIsSubmitting={setIsSubmitting} />}

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
