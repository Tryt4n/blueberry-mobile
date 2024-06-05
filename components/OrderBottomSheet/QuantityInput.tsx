import { View, Text, TextInput } from "react-native";
import React, { forwardRef, useRef, type ComponentProps, type ForwardedRef } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import ChangeQuantityBtn from "./ChangeQuantityBtn";

type QuantityInputProps = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  label?: string;
  containerStyles?: string;
} & Omit<ComponentProps<typeof TextInput>, "value">;

function InnerQuantityInput(
  { value, setValue, label, containerStyles, ...props }: QuantityInputProps,
  ref: ForwardedRef<TextInput>
) {
  const { colors } = useThemeContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleTextChange(e: string) {
    let newValue = e.replace(",", ".");
    if ((newValue.match(/\./g) || []).length > 1) {
      return;
    }
    if (e === "" || e.endsWith(".") || e.endsWith(",")) {
      setValue(e as unknown as number);
    } else {
      newValue = newValue.replace(/[^0-9.]/g, "");
      newValue = newValue.replace(/(\..*)\./g, "$1");
      newValue = newValue.replace(/(\.[0-9]{2})./g, "$1");
      if (newValue.startsWith(".")) newValue = "0" + newValue;
      const decimalValue = parseFloat(newValue);
      if (!isNaN(decimalValue)) {
        setValue(decimalValue);
      }
    }
  }

  function handleBlur() {
    setValue((prevValue) => {
      const prevValueStr = String(prevValue);
      if (prevValueStr === "" || prevValueStr.endsWith(".") || prevValueStr.endsWith(",")) return 1;
      const roundedValue = Math.round(prevValue / 0.25) * 0.25;
      if (roundedValue < 0.25) return 0.25;
      if (roundedValue > 100) return 100;
      return roundedValue;
    });
  }

  function handleValue(action: "increase" | "decrease") {
    setValue((prevValue) => {
      if (
        (prevValue <= 0.25 && action === "decrease") ||
        (prevValue >= 100 && action === "increase")
      )
        return prevValue;

      return prevValue + (action === "increase" ? 0.25 : -0.25);
    });
  }

  function handleLongPress(action: "increase" | "decrease") {
    intervalRef.current = setInterval(() => {
      handleValue(action);
    }, 100);
  }

  function handlePressOut() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return (
    <View className={containerStyles}>
      {label && (
        <Text
          style={tw`pb-1 font-poppinsMedium text-base font-medium text-center text-[${colors.text}]`}
        >
          {label}
        </Text>
      )}

      <View
        style={tw`h-16 mx-auto flex flex-row justify-center items-center border rounded-xl overflow-hidden border-[${colors.inputBorder}]`}
      >
        <ChangeQuantityBtn
          type="decrease"
          borderlineValue={value}
          onPress={() => handleValue("decrease")}
          onLongPress={() => handleLongPress("decrease")}
          onPressOut={handlePressOut}
        />

        <TextInput
          style={tw`w-20 h-full text-xl text-center justify-center font-poppinsSemiBold text-[${colors.text}]`}
          {...props}
          ref={ref}
          cursorColor={colors.primary}
          value={value.toString()}
          keyboardType="numeric"
          onChangeText={handleTextChange}
          onBlur={handleBlur}
        />

        <ChangeQuantityBtn
          type="increase"
          borderlineValue={value}
          onPress={() => handleValue("increase")}
          onLongPress={() => handleLongPress("increase")}
          onPressOut={handlePressOut}
        />
      </View>
    </View>
  );
}

export const QuantityInput = forwardRef(InnerQuantityInput);
