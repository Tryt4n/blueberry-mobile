import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/lib/twrnc";
import AuthAccountInfo from "@/components/AuthAccountInfo";
import { useGlobalContext } from "@/hooks/useGlobalContext";

type AuthLayoutProps = {
  type: "signIn" | "signUp";
  children: React.ReactNode;
};

export default function AuthLayout({ type, children }: AuthLayoutProps) {
  const { platform } = useGlobalContext();

  return (
    <SafeAreaView style={tw`h-full w-full ${platform === "web" ? " max-w-[720px] mx-auto" : ""}`}>
      <ScrollView>
        <View style={tw`px-4 pb-8`}>
          <Text style={tw`my-10 font-poppinsSemiBold text-2xl text-center`}>
            {type === "signIn" ? "Zaloguj się" : "Zarejestruj się"}
          </Text>

          {children}

          <AuthAccountInfo href={`${type === "signIn" ? "/signUp" : "/signIn"}`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
