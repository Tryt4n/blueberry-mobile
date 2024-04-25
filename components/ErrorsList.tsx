import { View, Text } from "react-native";
import React from "react";

export default function ErrorsList({ errors }: { errors: string[] }) {
  return (
    <View className="mt-2 mx-2">
      {errors.map((error, index) => (
        <Text
          key={index}
          className="text-red-500 text-sm mb-2 font-poppinsMedium"
        >
          {error}
        </Text>
      ))}
    </View>
  );
}
