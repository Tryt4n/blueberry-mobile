import { View, Text } from "react-native";
import React, { type ComponentProps } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import BouncyCheckbox from "react-native-bouncy-checkbox/build/dist/BouncyCheckbox";
import { Entypo } from "@expo/vector-icons";

type CheckboxProps = {
  status: boolean;
  label?: string;
  labelProps?: ComponentProps<typeof Text>;
  containerStyles?: string;
} & ComponentProps<typeof BouncyCheckbox>;

export default function Checkbox({
  status,
  label,
  labelProps,
  containerStyles,
  ...props
}: CheckboxProps) {
  const { theme, colors } = useThemeContext();

  return (
    <View style={tw`items-center${containerStyles ? ` ${containerStyles}` : ""}`}>
      {label && (
        <Text
          style={tw`text-center font-poppinsMedium mb-1 text-[${colors.text}]`}
          {...labelProps}
        >
          {label}
        </Text>
      )}

      <BouncyCheckbox
        size={50}
        fillColor={colors.primary}
        unFillColor="transparent"
        disableText={true}
        isChecked={status}
        iconComponent={
          <Entypo
            name="check"
            size={30}
            color={
              status
                ? theme === "light"
                  ? "white"
                  : colors.textAccent
                : theme === "light"
                ? "hsl(0, 0%, 97%)"
                : colors.text
            }
          />
        }
        innerIconStyle={{ borderWidth: status ? 0 : 2 }}
        textStyle={{ fontFamily: "Poppins-Medium" }}
        {...props}
      />
    </View>
  );
}
