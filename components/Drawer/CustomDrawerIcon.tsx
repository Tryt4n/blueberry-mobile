import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/hooks/useThemeContext";
import type { ComponentProps } from "react";

type CustomDrawerIconProps = {
  color: string;
  size: number;
  focused: boolean;
  name: ComponentProps<typeof Ionicons>["name"];
};

export default function CustomDrawerIcon({ color, size, focused, name }: CustomDrawerIconProps) {
  const { colors } = useThemeContext();

  return (
    <Ionicons
      name={name}
      size={size}
      color={focused ? color : colors.textAccent}
    />
  );
}
