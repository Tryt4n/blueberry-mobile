import { Platform, View } from "react-native";
import { router } from "expo-router";
import React, { useEffect } from "react";
import tw from "@/lib/twrnc";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useModalContext } from "@/hooks/useModalContext";
import { configureGoogleSignIn, getGoogleCurrentUser, signInWithGoogle } from "@/api/auth/google";
import type { GoogleSigninButton as GoogleSigninButtonType } from "@react-native-google-signin/google-signin";

// Use GoogleSignInButton only on native platforms
let GoogleSigninButton: typeof GoogleSigninButtonType;
if (Platform.OS !== "web") {
  ({ GoogleSigninButton } = require("@react-native-google-signin/google-signin"));
}

type GoogleSignInButtonProps = {
  setIsSubmitting: (value: boolean) => void;
} & React.ComponentProps<typeof GoogleSigninButton>;

export default function GoogleSignInButtonNative({
  setIsSubmitting,
  ...props
}: GoogleSignInButtonProps) {
  const { setUser, setIsLoggedIn, setAuthProvider } = useGlobalContext();
  const { setModalData, showModal } = useModalContext();

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
      setModalData((prevState) => ({
        ...prevState,
        title: "Błąd logowania",
        subtitle: "Nie udało się zalogować. Spróbuj ponownie.",
      }));
      showModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={tw`h-[70px] w-full mb-8`}>
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
