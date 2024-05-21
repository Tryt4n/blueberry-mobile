import { View, Text, TouchableOpacity } from "react-native";
import { useState, type ComponentProps } from "react";
import tw from "@/lib/twrnc";

type DateInputProps = {
  label: string;
  text: string;
  onPress: () => void;
  containerProps?: ComponentProps<typeof View>;
};

export function DateInput({ label, text, onPress, containerProps }: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={tw`pt-4`}
      {...containerProps}
    >
      <Text style={tw`text-base font-medium pb-1`}>{label}</Text>

      <TouchableOpacity
        style={tw`border-2 p-4 rounded-2xl${isFocused ? " border-primary" : ""}`}
        onPress={onPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Text style={tw`font-poppinsMedium text-center`}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
