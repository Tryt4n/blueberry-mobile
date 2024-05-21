import { View, TextInput, Platform } from "react-native";
import { useState, type ComponentProps } from "react";
import tw from "@/lib/twrnc";
import { colors } from "@/helpers/colors";

export default function ModalInput({ ...props }: ComponentProps<typeof TextInput>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={tw`flex justify-center items-center mt-2`}>
      <TextInput
        style={[
          tw`w-32 border-b-2 text-center font-poppinsMedium text-3xl${
            isFocused ? " border-primary" : ""
          }`,
          //@ts-ignore - `caretColor` is not recognized for <TextInput/>
          Platform.OS === "web" ? { outline: "none", caretColor: colors.primary } : {},
        ]}
        cursorColor={colors.primary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}
