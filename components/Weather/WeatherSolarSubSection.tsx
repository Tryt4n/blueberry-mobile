import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import MinMaxValues from "./MinMaxValues";
import type { CurrentWeatherValue, HistoryWeatherValue } from "@/types/weather";

type WeatherSolarSubSectionProps = {
  heading: string;
  currentValue: CurrentWeatherValue;
  historyList: HistoryWeatherValue["list"];
};

export default function WeatherSolarSubSection({
  heading,
  currentValue,
  historyList,
}: WeatherSolarSubSectionProps) {
  const { colors } = useThemeContext();

  return (
    <View style={tw`mb-2`}>
      <View style={tw`mb-1 flex-row items-baseline`}>
        <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}>
          {heading}: &nbsp;
        </Text>
        <Text style={tw`font-poppinsMedium text-3xl text-[${colors.text}]`}>
          {currentValue.value}
        </Text>
        <Text style={tw`font-poppinsRegular text-[${colors.textAccent}]`}>{currentValue.unit}</Text>
      </View>

      <MinMaxValues
        type="max"
        currentValue={currentValue}
        valuesList={historyList}
      />
    </View>
  );
}
