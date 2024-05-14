import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type ChangeQuantityBtnProps = {
  type: "increase" | "decrease";
  borderlineValue: number;
} & ComponentProps<typeof TouchableOpacity>;

export default function ChangeQuantityBtn({
  type,
  borderlineValue,
  ...props
}: ChangeQuantityBtnProps) {
  const condition =
    type === "decrease"
      ? borderlineValue <= 0.25
      : type === "increase"
      ? borderlineValue >= 100
      : false;

  return (
    <TouchableOpacity
      className={`h-full px-2 bg-blue-500 justify-center${condition ? " opacity-50" : ""}`}
      activeOpacity={0.7}
      disabled={condition}
      {...props}
    >
      <Entypo
        name={type === "decrease" ? "minus" : "plus"}
        size={32}
        color="white"
      />
    </TouchableOpacity>
  );
}
