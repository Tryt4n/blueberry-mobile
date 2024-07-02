import { View, TextInput, type StyleProp, type ViewStyle } from "react-native";
import { useState, type ComponentProps } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

type SimplifiedInputProps = {
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: string;
  disabled?: boolean;
} & Omit<ComponentProps<typeof TextInput>, "style">;

export default function SimplifiedInput({
  containerStyles,
  inputStyles,
  ...props
}: SimplifiedInputProps) {
  const { platform } = useGlobalContext();
  const { colors } = useThemeContext();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={containerStyles}>
      <TextInput
        style={[
          tw`min-w-[32px] border-b-2 text-center font-poppinsMedium capitalize text-base text-[${
            colors.text
          }]${isFocused ? ` border-[${colors.primary}]` : ` border-[${colors.inputBorder}]`}${
            inputStyles ? ` ${inputStyles}` : ""
          }`,
          platform === "web" ? { outline: "none", caretColor: colors.primary } : {},
        ]}
        cursorColor={colors.primary}
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus ? props.onFocus(e) : undefined;
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur ? props.onBlur(e) : undefined;
        }}
      />
    </View>
  );
}
