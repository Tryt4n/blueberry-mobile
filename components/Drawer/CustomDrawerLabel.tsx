import { Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

type CustomDrawerLabelProps = {
  color: string;
  focused: boolean;
  text: string;
};

export default function CustomDrawerLabel({ color, focused, text }: CustomDrawerLabelProps) {
  const { colors } = useThemeContext();

  return (
    <Text
      style={[tw`font-poppinsMedium text-base -ml-4`, { color: focused ? color : colors.menuIcon }]}
    >
      {text}
    </Text>
  );
}
