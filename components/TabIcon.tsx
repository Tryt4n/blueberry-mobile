import { View, Text } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type TabIconProps = {
  icon?: ComponentProps<typeof Ionicons>["name"];
  color: string;
  name?: string;
  focused?: boolean;
  gap?: number;
  iconsSize?: number;
  customIcon?: React.ReactNode;
};
export default function TabIcon({
  icon,
  color,
  name,
  focused,
  gap = 2,
  iconsSize = 24,
  customIcon,
}: TabIconProps) {
  const { height } = useGlobalContext();
  const { colors } = useThemeContext();

  return (
    <View style={tw`items-center gap-${gap}`}>
      {customIcon ? (
        customIcon
      ) : (
        <Ionicons
          name={icon}
          size={iconsSize}
          color={focused || color ? color : colors.tabIcon}
          disabled={!focused}
        />
      )}

      {name && (
        <Text
          style={tw`${height > 680 ? "text-sm" : "text-xs"} text-center text-[${colors.text}] ${
            focused ? "font-poppinsSemiBold" : "font-poppinsRegular"
          }`}
        >
          {name}
        </Text>
      )}
    </View>
  );
}
