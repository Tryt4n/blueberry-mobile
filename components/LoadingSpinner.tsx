import { ActivityIndicator, View } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

export default function LoadingSpinner({ color }: { color?: string }) {
  const { colors } = useThemeContext();

  return (
    <View
      style={tw`h-full flex justify-center bg-[${colors.bgAccent}]`}
      aria-label="Loading..."
    >
      <ActivityIndicator
        size="large"
        color={color ? color : colors.primary}
      />
    </View>
  );
}
