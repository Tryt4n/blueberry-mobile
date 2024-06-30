import { memo, type ComponentProps } from "react";
import { TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { Entypo } from "@expo/vector-icons";

type ChangeQuantityBtnProps = {
  type: "increase" | "decrease";
  borderlineValue: number;
} & ComponentProps<typeof TouchableOpacity>;

function ChangeQuantityBtn({ type, borderlineValue, ...props }: ChangeQuantityBtnProps) {
  const { theme, colors } = useThemeContext();

  const condition =
    type === "decrease"
      ? borderlineValue <= 0.25
      : type === "increase"
      ? borderlineValue >= 100
      : false;

  return (
    <TouchableOpacity
      style={tw`h-full px-2 bg-[${colors.primary}] justify-center${condition ? " opacity-50" : ""}`}
      activeOpacity={0.7}
      disabled={condition}
      {...props}
    >
      <Entypo
        name={type === "decrease" ? "minus" : "plus"}
        size={32}
        color={theme === "dark" ? colors.text : colors.bg}
      />
    </TouchableOpacity>
  );
}

export default memo(ChangeQuantityBtn);
