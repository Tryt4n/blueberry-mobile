import { TouchableOpacity } from "react-native";
import React, { type ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function AddButton({ ...props }: ComponentProps<typeof TouchableOpacity>) {
  return (
    <TouchableOpacity
      className="-translate-y-[12px]"
      {...props}
    >
      <Ionicons
        name="add-circle"
        size={48}
        color="rgb(59 130 246)"
      />
    </TouchableOpacity>
  );
}
