import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import WeatherSection from "./WeatherSection";
import WeatherChange from "./WeatherChange";
import MinMaxValues from "./MinMaxValues";
import type { CurrentWeatherValue, HistoryWeatherValue } from "@/types/weather";

type WeatherTemperatureSectionProps = {
  heading: string;
  currentTemp: CurrentWeatherValue;
  historyTempList: HistoryWeatherValue["list"];
  unit: string;
};

export default function WeatherTemperatureSection({
  heading,
  currentTemp,
  historyTempList,
  unit,
}: WeatherTemperatureSectionProps) {
  const { colors } = useThemeContext();

  return (
    <WeatherSection
      heading={heading}
      containerStyles="mt-4"
    >
      <View style={tw`flex-row items-baseline`}>
        <Text style={tw`my-1 font-poppinsMedium text-3xl text-[${colors.text}]`}>
          {currentTemp.value}
        </Text>
        <Text style={tw`font-poppinsMedium text-xl text-[${colors.textAccent}]`}>&nbsp;{unit}</Text>
      </View>

      <WeatherChange
        unit={unit}
        currentValue={currentTemp.value}
        valuesList={historyTempList}
      />

      <View style={tw`mt-2 flex-row gap-x-4`}>
        <MinMaxValues
          type="max"
          currentValue={currentTemp}
          valuesList={historyTempList}
        />

        <MinMaxValues
          type="min"
          currentValue={currentTemp}
          valuesList={historyTempList}
        />
      </View>
    </WeatherSection>
  );
}
