import { TouchableOpacity } from "react-native";
import tw from "@/lib/twrnc";
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
      style={tw`h-full px-2 bg-primary justify-center${condition ? " opacity-50" : ""}`}
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
