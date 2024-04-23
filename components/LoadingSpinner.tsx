import { ActivityIndicator, View } from "react-native";
import React from "react";

export default function LoadingSpinner({ color }: { color?: string }) {
  return (
    <View
      className="h-full flex justify-center"
      aria-label="Loading..."
    >
      <ActivityIndicator
        size="large"
        color={color}
      />
    </View>
  );
}
