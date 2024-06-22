import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

export default function NotVerifiedAccountMessage() {
  const { colors } = useThemeContext();

  return (
    <View style={tw`h-full px-4 items-center justify-center bg-[${colors.bg}]`}>
      <Text style={tw`mb-2 font-poppinsSemiBold text-2xl text-center text-[${colors.text}]`}>
        Konto nieaktywne
      </Text>

      <Text style={tw`font-poppinsMedium text-base text-center text-[${colors.text}]`}>
        Poczekaj na weryfikację konta przez administratora.
      </Text>
    </View>
  );
}
