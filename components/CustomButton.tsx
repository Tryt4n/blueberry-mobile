import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React, { type ComponentPropsWithoutRef } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import tw from "@/lib/twrnc";

type CustomButtonProps = {
  text: string;
  containerStyles?: string;
  textStyles?: string;
  loading?: boolean;
  loadingColor?: string;
  loadingSpinnerSize?: "small" | "large";
} & Omit<ComponentPropsWithoutRef<typeof TouchableOpacity>, "className">;

export default function CustomButton({
  text,
  containerStyles,
  textStyles,
  loading,
  loadingColor = "white",
  loadingSpinnerSize = "large",
  ...props
}: CustomButtonProps) {
  const { platform } = useGlobalContext();

  return (
    <TouchableOpacity
      style={tw`bg-primary rounded-xl justify-center items-center${
        platform === "web" && props.disabled ? " opacity-70 cursor-not-allowed" : ""
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
          size={loadingSpinnerSize}
          color={loadingColor}
        />
      )}
    </TouchableOpacity>
  );
}
