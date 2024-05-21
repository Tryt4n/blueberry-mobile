import { ActivityIndicator, Platform, Text, TouchableOpacity } from "react-native";
import React, { type ComponentPropsWithoutRef } from "react";
import tw from "@/lib/twrnc";

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
      style={tw`bg-primary rounded-xl justify-center items-center${
        Platform.OS === "web" && props.disabled ? " opacity-70 cursor-not-allowed" : ""
      }${containerStyles ? ` ${containerStyles}` : ""}`}
      {...props}
      activeOpacity={0.7}
    >
      {!loading ? (
        <Text
          style={tw`text-white font-poppinsSemiBold text-base p-4${
            textStyles ? ` ${textStyles}` : ""
          }`}
        >
          {text}
        </Text>
      ) : (
        <ActivityIndicator
          style={tw`p-3 text-base`}
          size="large"
          color={loadingColor}
        />
      )}
    </TouchableOpacity>
  );
}
