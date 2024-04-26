import { Alert, type TextInput } from "react-native";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { createUser } from "@/api/auth/appwrite";
import { createOnSubmitEditing } from "@/helpers/authForms";
import AuthLayout from "@/layout/AuthLayout";
import { FormField } from "@/components/FormField";
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
      return Alert.alert("Puste pola", "Wszystkie pola muszą być wypełnione.");
    }
    if (signInForm.password !== signInForm.passwordConfirmation) {
      return Alert.alert("Niezgodność haseł", "Hasła muszą być identyczne.");
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

  if (errors.alert && errors.alert.length > 0) {
    Alert.alert("Błąd rejestracji", errors.alert.join("\n")); // Every error message will be displayed in a new line
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
        onSubmitEditing={createOnSubmitEditing(isSubmitting, signInForm, emailRef, createAccount)}
      />

      <FormField
        ref={emailRef}
        title="Email:"
        placeholder="Uzupełnij email"
        keyboardType="email-address"
        errors={errors.email}
        handleChangeText={(e) => setSignInForm({ ...signInForm, email: e })}
        onSubmitEditing={createOnSubmitEditing(
          isSubmitting,
          signInForm,
          passwordRef,
          createAccount
        )}
      />

      <FormField
        ref={passwordRef}
        title="Hasło:"
        placeholder="Uzupełnij hasło"
        secureTextEntry={true}
        errors={errors.password}
        handleChangeText={(e) => setSignInForm({ ...signInForm, password: e })}
        onSubmitEditing={createOnSubmitEditing(
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
        onSubmitEditing={createOnSubmitEditing(
          isSubmitting,
          signInForm,
          usernameRef,
          createAccount
        )}
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
