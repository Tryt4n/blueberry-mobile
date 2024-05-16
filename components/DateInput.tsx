import { View, Text, TouchableOpacity } from "react-native";
import type { ComponentProps } from "react";

type DateInputProps = {
  label: string;
  text: string;
  onPress: () => void;
  containerProps?: ComponentProps<typeof View>;
};

export function DateInput({ label, text, onPress, containerProps }: DateInputProps) {
  return (
    <View
      className="pt-4"
      {...containerProps}
    >
      <Text className="text-base font-medium pb-1">{label}</Text>

      <TouchableOpacity
        className="border-2 border-black-200 p-4 rounded-2xl hover:border-blue-500"
        onPress={onPress}
      >
        <Text className="font-poppinsMedium text-center">{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
