import { View, Text } from "react-native";
import { Link } from "expo-router";
import tw from "@/lib/twrnc";

export default function AuthAccountInfo({ href }: { href: "/signIn" | "/signUp" }) {
  return (
    <View style={tw`justify-center pt-5 flex-row gap-2`}>
      <Text style={tw`font-poppinsRegular text-lg`}>
        {href === "/signIn" ? "Masz już konto? " : href === "/signUp" ? "Nie masz konta? " : ""}
        <Link
          href={href}
          style={tw`font-poppinsSemiBold text-lg text-primary`}
        >
          {href === "/signIn" ? "Zaloguj sie " : href === "/signUp" ? "Zarejestruj się " : ""}
        </Link>
      </Text>
    </View>
  );
}
