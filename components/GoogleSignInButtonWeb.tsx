import { View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useModalContext } from "@/hooks/useModalContext";
import { getGoogleCurrentUser, signInWithGoogleWeb } from "@/api/auth/google";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import tw from "@/lib/twrnc";

export default function GoogleSignInButtonWeb({
  setIsSubmitting,
}: {
  setIsSubmitting: (value: boolean) => void;
}) {
  const { setUser, setIsLoggedIn, setAuthProvider } = useGlobalContext();
  const { setModalData, showModal } = useModalContext();
  const { width } = useWindowDimensions();

  async function handleGoogleWebSignIn(credentialResponse: CredentialResponse) {
    if (!credentialResponse.clientId) return;

    setIsSubmitting(true);

    try {
      const user = await signInWithGoogleWeb(credentialResponse);

      if (user) {
        const result = await getGoogleCurrentUser(user.id);

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
    <View style={tw`mb-4 items-center`}>
      <GoogleLogin
        onSuccess={(credentialResponse) => handleGoogleWebSignIn(credentialResponse)}
        size="large"
        width={width >= 450 ? 400 : 300}
        locale="pl"
        shape="pill"
        logo_alignment="center"
        text="continue_with"
      />
    </View>
  );
}
