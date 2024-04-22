import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState, type ComponentPropsWithoutRef } from "react";
import { Ionicons } from "@expo/vector-icons";

type FormFieldProps = {
  title: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
} & ComponentPropsWithoutRef<typeof TextInput>;

export default function FormField({
  title,
  handleChangeText,
  otherStyles,
  ...props
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`relative mb-4${otherStyles ? ` ${otherStyles}` : ""}`}>
      <Text className="pb-1 text-base font-medium">{title}</Text>

      <View className="border-2 border-black-200 w-full p-4 bg-black-100 rounded-2xl focus:border-blue-500 flex-row items-center">
        <TextInput
          {...props}
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
    </View>
  );
}
