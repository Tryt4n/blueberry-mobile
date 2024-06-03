import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

export default function ErrorsList({ errors }: { errors: string[] }) {
  const { colors } = useThemeContext();

  return (
    <View style={tw`mt-2 mx-2`}>
      {errors.map((error, index) => (
        <Text
          key={index}
          style={tw`text-[${colors.danger}] text-sm mb-2 font-poppinsMedium`}
        >
          {error}
        </Text>
      ))}
    </View>
  );
}
