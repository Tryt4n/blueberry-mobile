import { Text, ActivityIndicator } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

export default function PriceLoadingText({
  text,
  value,
  isLoading,
}: {
  text: string;
  value: string;
  isLoading?: boolean;
}) {
  const { colors } = useThemeContext();

  return (
    <Text style={tw`font-poppinsRegular items-center text-base text-[${colors.text}]`}>
      {text}&nbsp;
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      ) : (
        <Text style={tw`font-poppinsMedium text-xl`}>{value} zł</Text>
      )}
    </Text>
  );
}
