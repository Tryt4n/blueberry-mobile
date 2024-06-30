import { TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export default function ScrollToTop({ ...props }: ComponentProps<typeof TouchableOpacity>) {
  const { theme, colors } = useThemeContext();

  return (
    <TouchableOpacity
      style={tw`absolute right-[6.5%] bottom-[5%] rounded-full p-2 bg-[${colors.primary}] cursor-pointer`}
      {...props}
    >
      <Ionicons
        name="arrow-up"
        size={24}
        color={theme === "dark" ? colors.text : colors.bg}
      />
    </TouchableOpacity>
  );
}
