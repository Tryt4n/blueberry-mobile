import { View, Text } from "react-native";
import { Link } from "expo-router";
import { useThemeContext } from "@/hooks/useThemeContext";
import { colors as customColors } from "@/helpers/colors";
import tw from "@/lib/twrnc";

export default function AuthAccountInfo({ href }: { href: "/signIn" | "/signUp" }) {
  const { colors } = useThemeContext();

  return (
    <View style={tw`justify-center pt-5 flex-row gap-2`}>
      <Text style={tw`font-poppinsRegular text-lg text-[${colors.text}]`}>
        {href === "/signIn" ? "Masz już konto? " : href === "/signUp" ? "Nie masz konta? " : ""}
        <Link
          href={href}
          style={tw`font-poppinsSemiBold text-lg text-[${customColors.primaryLight}]`}
        >
          {href === "/signIn" ? "Zaloguj sie " : href === "/signUp" ? "Zarejestruj się " : ""}
        </Link>
      </Text>
    </View>
  );
}
