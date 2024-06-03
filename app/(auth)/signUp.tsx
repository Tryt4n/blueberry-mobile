import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOnSubmitEditing } from "@/hooks/useOnSubmitEditing";
import { createUser } from "@/api/auth/appwrite";
import AuthLayout from "@/layout/AuthLayout";
import Toast from "react-native-toast-message";
import { FormField } from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import type { TextInput } from "react-native";
import type { ErrorKeys } from "@/types/Errors";

export default function SignUpPage() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const { theme } = useThemeContext();
  const { setModalData, showModal } = useModalContext();

  const [signInForm, setSignInForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialErrorsState = {
    email: null,
    username: null,
    password: null,
    passwordConfirmation: null,
    alert: null,
  };
  const [errors, setErrors] = useState<Record<ErrorKeys, string[] | null>>(initialErrorsState);

  const emailRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmationRef = useRef<TextInput>(null);

  async function createAccount() {
    if (
      signInForm.username === "" ||
      signInForm.email === "" ||
      signInForm.password === "" ||
      signInForm.passwordConfirmation === ""
    ) {
      setModalData({
        title: "Puste pola",
        subtitle: "Wszystkie pola muszą być wypełnione.",
        btn1: { text: "Ok" },
      });
      showModal();
      return;
    }
    if (signInForm.password !== signInForm.passwordConfirmation) {
      setModalData({
        title: "Niezgodność haseł",
        subtitle: "Hasła muszą być identyczne.",
        btn1: { text: "Ok" },
      });
      showModal();
      return;
    }

    setIsSubmitting(true);

    try {
      setErrors(initialErrorsState);

      const result = await createUser(
        signInForm.email,
        signInForm.password,
        signInForm.username,
        signInForm.passwordConfirmation
      );

      if (result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: "Pomyślnie utworzono konto.",
          topOffset: 50,
          text1Style: { textAlign: "center" },
        });

        router.replace("/");
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      setModalData({
        title: "Błąd rejestracji",
        subtitle: "Nie udało się utworzyć konta. Spróbuj ponownie.",
        btn1: { text: "Ok" },
      });
      showModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (errors.alert && errors.alert.length > 0) {
    setModalData({
      title: "Błąd rejestracji",
      subtitle: `${errors.alert?.join("\n")}`,
      btn1: { text: "Ok" },
    });
    showModal();
    setErrors({ ...errors, alert: [] });
  }

  return (
    <AuthLayout type="signUp">
      <FormField
        ref={usernameRef}
        title="Nazwa użytkownika:"
        placeholder="Wprowadź swoją nazwę"
        errors={errors.username}
        handleChangeText={(e) => setSignInForm({ ...signInForm, username: e })}
        onSubmitEditing={useOnSubmitEditing(isSubmitting, signInForm, emailRef, createAccount)}
      />

      <FormField
        ref={emailRef}
        title="Email:"
        placeholder="Uzupełnij email"
        keyboardType="email-address"
        errors={errors.email}
        handleChangeText={(e) => setSignInForm({ ...signInForm, email: e })}
        onSubmitEditing={useOnSubmitEditing(isSubmitting, signInForm, passwordRef, createAccount)}
      />

      <FormField
        ref={passwordRef}
        title="Hasło:"
        placeholder="Uzupełnij hasło"
        secureTextEntry={true}
        errors={errors.password}
        handleChangeText={(e) => setSignInForm({ ...signInForm, password: e })}
        onSubmitEditing={useOnSubmitEditing(
          isSubmitting,
          signInForm,
          passwordConfirmationRef,
          createAccount
        )}
      />

      <FormField
        ref={passwordConfirmationRef}
        title="Potwierdź hasło:"
        placeholder="Uzupełnij hasło ponownie"
        secureTextEntry={true}
        errors={errors.passwordConfirmation}
        handleChangeText={(e) => setSignInForm({ ...signInForm, passwordConfirmation: e })}
        onSubmitEditing={useOnSubmitEditing(isSubmitting, signInForm, usernameRef, createAccount)}
      />

      <CustomButton
        text="Zarejestruj się"
        disabled={isSubmitting}
        onPress={createAccount}
        containerStyles="mt-5"
        textStyles="text-xl"
        loading={isSubmitting}
      />
    </AuthLayout>
  );
}
