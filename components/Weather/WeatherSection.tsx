import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

type WeatherSectionProps = {
  heading: string;
  children: React.ReactNode;
  containerStyles?: string;
};

export default function WeatherSection({
  children,
  heading,
  containerStyles,
}: WeatherSectionProps) {
  const { colors } = useThemeContext();

  return (
    <View style={tw`justify-center items-center${containerStyles ? ` ${containerStyles}` : ""}`}>
      <Text style={tw`font-poppinsSemiBold text-lg text-[${colors.text}]`}>{heading}</Text>

      {children}
    </View>
  );
}
