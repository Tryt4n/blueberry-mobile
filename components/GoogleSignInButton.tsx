import { Alert, View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { configureGoogleSignIn, getGoogleCurrentUser, signInWithGoogle } from "@/api/auth/google";

type GoogleSignInButtonProps = {
  setIsSubmitting: (value: boolean) => void;
} & React.ComponentProps<typeof GoogleSigninButton>;

export default function GoogleSignInButton({ setIsSubmitting, ...props }: GoogleSignInButtonProps) {
  const { setUser, setIsLoggedIn, setAuthProvider } = useGlobalContext();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  async function handleGoogleSignIn() {
    setIsSubmitting(true);

    try {
      const session = await signInWithGoogle();

      if (session) {
        const result = await getGoogleCurrentUser(session.user);

        if (result) {
          setUser(result);
          setIsLoggedIn(true);
          setAuthProvider("google");

          router.replace("/");
        } else {
          throw new Error("User not found");
        }
      }
    } catch (error) {
      Alert.alert("Błąd logowania", "Nie udało się zalogować. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="h-[70] w-full mb-8">
      <GoogleSigninButton
        onPress={handleGoogleSignIn}
        {...props}
        size={GoogleSigninButton.Size.Wide}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
