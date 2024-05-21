import { TouchableOpacity } from "react-native";
import React, { type ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/helpers/colors";

export default function AddButton({ ...props }: ComponentProps<typeof TouchableOpacity>) {
  return (
    <TouchableOpacity
      style={{ transform: [{ translateY: -12 }] }}
      {...props}
    >
      <Ionicons
        name="add-circle"
        size={48}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
}
