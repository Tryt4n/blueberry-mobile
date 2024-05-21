import { ActivityIndicator, View } from "react-native";
import tw from "@/lib/twrnc";

export default function LoadingSpinner({ color }: { color?: string }) {
  return (
    <View
      style={tw`h-full flex justify-center`}
      aria-label="Loading..."
    >
      <ActivityIndicator
        size="large"
        color={color}
      />
    </View>
  );
}
