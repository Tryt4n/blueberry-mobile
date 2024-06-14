import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

type WeatherAstronomicPanelSectionProps = {
  heading: string;
  value: string;
};

export default function WeatherAstronomicPanelSection({
  heading,
  value,
}: WeatherAstronomicPanelSectionProps) {
  const { colors } = useThemeContext();

  return (
    <View style={tw`flex-row items-baseline`}>
      <Text style={tw`font-poppinsRegular text-[${colors.textAccent}]`}>{heading}:&nbsp;</Text>
      <Text style={tw`font-poppinsRegular text-base text-[${colors.text}]`}>{value}</Text>
    </View>
  );
}
