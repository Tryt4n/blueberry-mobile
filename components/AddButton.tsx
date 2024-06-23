import { TouchableOpacity } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export default function AddButton({ ...props }: ComponentProps<typeof TouchableOpacity>) {
  const { height } = useGlobalContext();
  const { theme, colors } = useThemeContext();

  return (
    <TouchableOpacity
      style={tw`${
        height > 680 ? "h-10 w-10" : "h-8 w-8"
      } items-center justify-center rounded-full bg-[${colors.primary}] aspect-square`}
      {...props}
    >
      <Ionicons
        name="add-outline"
        size={height > 680 ? 28 : 24}
        color={theme === "dark" ? colors.text : colors.bgAccent}
      />
    </TouchableOpacity>
  );
}
