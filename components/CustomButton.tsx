import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React, { type ComponentPropsWithoutRef } from "react";

type CustomButtonProps = {
  text: string;
  containerStyles?: string;
  textStyles?: string;
  loading?: boolean;
  loadingColor?: string;
} & Omit<ComponentPropsWithoutRef<typeof TouchableOpacity>, "className">;

export default function CustomButton({
  text,
  containerStyles,
  textStyles,
  loading,
  loadingColor = "white",
  ...props
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-blue-500 rounded-xl justify-center items-center${
        props.disabled ? " opacity-70 cursor-not-allowed" : ""
      }${containerStyles ? ` ${containerStyles}` : ""}`}
      {...props}
      activeOpacity={0.7}
    >
      {!loading ? (
        <Text
          className={`text-white font-poppinsSemiBold text-base p-4${
            textStyles ? ` ${textStyles}` : ""
          }`}
        >
          {text}
        </Text>
      ) : (
        <ActivityIndicator
          className="p-3 text-base font-poppinsSemiBold"
          size="large"
          color={loadingColor}
        />
      )}
    </TouchableOpacity>
  );
}
