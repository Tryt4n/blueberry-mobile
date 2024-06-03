import { View, Text, TouchableOpacity } from "react-native";
import { useState, type ComponentProps } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

type DateInputProps = {
  label: string;
  text: string;
  onPress: () => void;
  containerProps?: ComponentProps<typeof View>;
};

export function DateInput({ label, text, onPress, containerProps }: DateInputProps) {
  const { colors } = useThemeContext();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={tw`pt-4`}
      {...containerProps}
    >
      <Text style={tw`font-poppinsRegular text-base font-medium pb-1 text-[${colors.text}]`}>
        {label}
      </Text>

      <TouchableOpacity
        style={tw`border-2 p-4 rounded-2xl border-[${colors.inputBorder}]${
          isFocused ? ` border-[${colors.primary}]` : ""
        }`}
        onPress={onPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Text style={tw`font-poppinsMedium text-center text-[${colors.textAccent}]`}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
