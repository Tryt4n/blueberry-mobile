import { View, TextInput } from "react-native";
import { useState, type ComponentProps } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

export default function ModalInput({ ...props }: ComponentProps<typeof TextInput>) {
  const { platform } = useGlobalContext();
  const { colors } = useThemeContext();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={tw`flex justify-center items-center mt-2`}>
      <TextInput
        style={[
          tw`w-32 border-b-2 text-center font-poppinsMedium text-3xl text-[${colors.text}]${
            isFocused ? ` border-[${colors.primary}]` : ` border-[${colors.inputBorder}]`
          }`,
          platform === "web" ? { outline: "none", caretColor: colors.primary } : {},
        ]}
        cursorColor={colors.primary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}
