import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React, { type ComponentPropsWithoutRef, memo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

type CustomButtonProps = {
  text: string;
  containerStyles?: string;
  textStyles?: string;
  loading?: boolean;
  loadingColor?: string;
  loadingSpinnerSize?: "small" | "large";
} & Omit<ComponentPropsWithoutRef<typeof TouchableOpacity>, "className">;

function CustomButton({
  text,
  containerStyles,
  textStyles,
  loading,
  loadingColor,
  loadingSpinnerSize = "large",
  ...props
}: CustomButtonProps) {
  const { platform } = useGlobalContext();
  const { theme, colors } = useThemeContext();

  return (
    <TouchableOpacity
      style={tw`bg-[${colors.primary}] rounded-xl justify-center items-center${
        platform === "web" && props.disabled ? " opacity-70 cursor-not-allowed" : ""
      }${containerStyles ? ` ${containerStyles}` : ""}`}
      {...props}
      activeOpacity={0.7}
    >
      {!loading ? (
        <Text
          style={[
            tw`font-poppinsSemiBold text-base p-4 text-white ${textStyles ? ` ${textStyles}` : ""}${
              theme === "dark" ? ` text-[${colors.text}]` : ""
            }`,
          ]}
        >
          {text}
        </Text>
      ) : (
        <ActivityIndicator
          style={tw`p-3 text-base`}
          size={loadingSpinnerSize}
          color={loadingColor ? loadingColor : theme === "light" ? "white" : colors.text}
        />
      )}
    </TouchableOpacity>
  );
}

export default memo(CustomButton);
