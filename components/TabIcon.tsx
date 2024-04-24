import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type TabIconProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  name: string;
  focused: boolean;
  gap?: number;
  iconsSize?: number;
};

export default function TabIcon({
  icon,
  color,
  name,
  focused,
  gap = 2,
  iconsSize = 24,
}: TabIconProps) {
  return (
    <View className={`items-center gap-${gap}`}>
      <Ionicons
        name={icon}
        size={iconsSize}
        color={color}
        disabled={!focused}
      />

      <Text
        className={`${
          focused ? "font-poppinsSemiBold" : "font-poppinsRegular"
        } text-sm text-center`}
      >
        {name}
      </Text>
    </View>
  );
}
