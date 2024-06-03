import { Platform, View } from "react-native";
import { router } from "expo-router";
import React, { useEffect } from "react";
import tw from "@/lib/twrnc";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useModalContext } from "@/hooks/useModalContext";
import { configureGoogleSignInNative, signInWithGoogleNative } from "@/api/auth/google";
import { getCurrentUser } from "@/api/auth/appwrite";
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
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const { theme } = useThemeContext();
  const { setModalData, showModal } = useModalContext();

  useEffect(() => {
    configureGoogleSignInNative();
  }, []);

  async function handleGoogleSignIn() {
    setIsSubmitting(true);

    try {
      const session = await signInWithGoogleNative();

      if (session) {
        const result = await getCurrentUser();

        if (result) {
          setUser(result);
          setIsLoggedIn(true);

          router.replace("/");
        } else {
          throw new Error("User not found");
        }
      }
    } catch (error) {
      setModalData({
        title: "Błąd logowania",
        subtitle: "Nie udało się zalogować. Spróbuj ponownie.",
        btn1: { text: "Ok" },
      });
      showModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={tw`h-[70px] w-full mb-8 bg-transparent`}>
      <GoogleSigninButton
        onPress={handleGoogleSignIn}
        {...props}
        size={GoogleSigninButton.Size.Wide}
        color={theme === "light" ? GoogleSigninButton.Color.Light : GoogleSigninButton.Color.Dark}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
