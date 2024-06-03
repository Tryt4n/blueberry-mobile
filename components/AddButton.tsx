import { TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export default function AddButton({ ...props }: ComponentProps<typeof TouchableOpacity>) {
  const { theme, colors } = useThemeContext();

  return (
    <TouchableOpacity
      style={tw`h-10 w-10 items-center justify-center rounded-full bg-[${colors.primary}] aspect-square`}
      {...props}
    >
      <Ionicons
        name="add-outline"
        size={28}
        color={theme === "dark" ? colors.text : colors.bgAccent}
      />
    </TouchableOpacity>
  );
}
