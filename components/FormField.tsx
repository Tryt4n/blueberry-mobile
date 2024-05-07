import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { forwardRef, useState, type ComponentProps, type ForwardedRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import ErrorsList from "./ErrorsList";

type FormFieldProps = {
  title: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  errors?: string[] | null;
} & ComponentProps<typeof TextInput>;

function InnerFormField(
  { title, handleChangeText, otherStyles, errors, ...props }: FormFieldProps,
  ref: ForwardedRef<TextInput>
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`relative mb-4${otherStyles ? ` ${otherStyles}` : ""}`}>
      <Text className="pb-1 text-base font-medium">{title}</Text>

      <View className="border-2 border-black-200 w-full p-4 bg-black-100 rounded-2xl focus:border-blue-500 flex-row items-center">
        <TextInput
          {...props}
          ref={ref}
          cursorColor="rgb(59 130 246)"
          className="flex-1 font-poppinsSemiBold text-base"
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={props.secureTextEntry && !showPassword}
          keyboardType={
            props.secureTextEntry && showPassword ? "visible-password" : props.keyboardType
          }
        />

        {props.secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-0 p-4"
          >
            <Ionicons
              name={!showPassword ? "eye" : "eye-off"}
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>

      {errors && errors.length > 0 && <ErrorsList errors={errors} />}
    </View>
  );
}

export const FormField = forwardRef(InnerFormField);
