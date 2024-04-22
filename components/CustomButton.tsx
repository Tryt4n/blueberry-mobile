import { View, Text, TouchableOpacity } from "react-native";
import React, { type ComponentPropsWithoutRef } from "react";

type CustomButtonProps = {
  text: string;
  containerStyles?: string;
  textStyles?: string;
} & Omit<ComponentPropsWithoutRef<typeof TouchableOpacity>, "className">;

export default function CustomButton({
  text,
  containerStyles,
  textStyles,
  ...props
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-blue-500 rounded-xl justify-center items-center${
        containerStyles ? ` ${containerStyles}` : ""
      }`}
      {...props}
    >
      <Text
        className={`text-white font-poppinsSemiBold text-base p-4${
          textStyles ? ` ${textStyles}` : ""
        }`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
