import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { forwardRef, useState, type ComponentProps, type ForwardedRef } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { Ionicons } from "@expo/vector-icons";
import ErrorsList from "./ErrorsList";

type FormFieldProps = {
  title: string;
  handleChangeText: (e: string) => void;
  titleStyles?: string;
  otherStyles?: string;
  errors?: string[] | null;
} & ComponentProps<typeof TextInput>;

function InnerFormField(
  { title, handleChangeText, otherStyles, titleStyles, errors, ...props }: FormFieldProps,
  ref: ForwardedRef<TextInput>
) {
  const { platform } = useGlobalContext();
  const { colors } = useThemeContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={tw`relative mb-4${otherStyles ? ` ${otherStyles}` : ""}`}>
      <Text
        style={tw`pb-1 text-base font-medium text-[${colors.text}]${
          titleStyles ? ` ${titleStyles}` : ""
        }`}
      >
        {title}
      </Text>

      <View
        style={[
          tw`border-2 w-full p-4 rounded-2xl flex-row items-center`,
          { borderColor: isFocused ? colors.primary : colors.inputBorder },
        ]}
      >
        <TextInput
          {...props}
          ref={ref}
          cursorColor={colors.primary}
          style={[
            tw`flex-1 font-poppinsSemiBold text-base text-[${colors.textAccent}]`,
            platform === "web"
              ? {
                  // @ts-ignore - `caretColor` is not recognized for <TextInput/>
                  outline: "none",
                  caretColor: colors.primary,
                }
              : {},
          ]}
          placeholderTextColor={colors.placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={props.secureTextEntry && !showPassword}
          keyboardType={
            props.secureTextEntry && showPassword ? "visible-password" : props.keyboardType
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {props.secureTextEntry && (
          <ShowPasswordBtn
            visible={showPassword}
            onPress={() => setShowPassword(!showPassword)}
          />
        )}
      </View>

      {errors && errors.length > 0 && <ErrorsList errors={errors} />}
    </View>
  );
}

export const FormField = forwardRef(InnerFormField);

function ShowPasswordBtn({
  visible,
  ...props
}: { visible: boolean } & ComponentProps<typeof TouchableOpacity>) {
  const { colors } = useThemeContext();

  return (
    <TouchableOpacity
      style={tw`absolute right-0 p-4 rounded-r-2xl`}
      {...props}
    >
      <Ionicons
        name={!visible ? "eye" : "eye-off"}
        color={colors.placeholder}
        size={24}
      />
    </TouchableOpacity>
  );
}
