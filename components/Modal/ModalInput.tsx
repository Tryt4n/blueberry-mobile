import { View, TextInput } from "react-native";
import { useState, type ComponentProps } from "react";

export default function ModalInput({ ...props }: ComponentProps<typeof TextInput>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="flex justify-center items-center mt-2">
      <TextInput
        className="w-32 border-b-2 text-center font-poppinsMedium text-3xl"
        style={{ borderColor: isFocused ? "rgb(59 130 246)" : undefined }}
        cursorColor="rgb(59 130 246)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}
