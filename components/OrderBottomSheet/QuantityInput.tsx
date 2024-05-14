import { View, Text, TextInput } from "react-native";
import React, { forwardRef, useRef, type ComponentProps, type ForwardedRef } from "react";
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
      {label && <Text className="pb-1 text-base font-medium text-center">{label}</Text>}

      <View className="flex flex-row justify-center items-center max-w-max mx-auto border border-gray-500 rounded-xl overflow-hidden h-16">
        <ChangeQuantityBtn
          type="decrease"
          borderlineValue={value}
          onPress={() => handleValue("decrease")}
          onLongPress={() => handleLongPress("decrease")}
          onPressOut={handlePressOut}
        />

        <TextInput
          className="w-20 h-full text-xl text-center justify-center font-poppinsSemiBold"
          {...props}
          ref={ref}
          cursorColor="rgb(59 130 246)"
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
