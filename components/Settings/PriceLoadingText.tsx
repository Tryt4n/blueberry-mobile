import { Text, ActivityIndicator } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
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
  const { height } = useGlobalContext();
  const { colors } = useThemeContext();

  return (
    <Text
      style={tw`font-poppinsRegular items-center ${height > 680 ? "text-base" : "text-sm"} text-[${
        colors.text
      }]`}
    >
      {text}&nbsp;
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      ) : (
        <Text style={tw`font-poppinsMedium ${height > 680 ? "text-xl" : "text-lg"}`}>
          {value} zł
        </Text>
      )}
    </Text>
  );
}
