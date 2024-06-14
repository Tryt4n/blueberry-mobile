import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import MinMaxValues from "./MinMaxValues";
import type { CurrentWeather, HistoryWeather } from "@/types/weather";

type WindSubSectionProps = {
  heading: string;
  windSpeed: CurrentWeather["wind"]["wind_speed"];
  historyWindList: HistoryWeather["wind"]["wind_speed"]["list"];
  unit: CurrentWeather["wind"]["wind_speed"]["unit"];
};

export default function WeatherWindSubSection({
  heading,
  windSpeed,
  historyWindList,
  unit,
}: WindSubSectionProps) {
  const { colors } = useThemeContext();
  return (
    <View>
      <View style={tw`flex-row items-baseline`}>
        <Text style={tw`mb-2 text-base font-poppinsRegular text-[${colors.textAccent}]`}>
          {heading}:&nbsp;
        </Text>
        <Text style={tw`text-3xl font-poppinsMedium text-[${colors.text}]`}>{windSpeed.value}</Text>
        <Text style={tw`mb-2 text-base font-poppinsRegular text-[${colors.textAccent}]`}>
          &nbsp;{unit}
        </Text>
      </View>

      <MinMaxValues
        type="max"
        currentValue={windSpeed}
        valuesList={historyWindList}
      />
    </View>
  );
}
