import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import WeatherChange from "./WeatherChange";
import MinMaxValues from "./MinMaxValues";
import type { CurrentWeatherValue, HistoryWeatherValue } from "@/types/weather";

type WeatherPressureSubSectionProps = {
  heading: string;
  pressure: CurrentWeatherValue;
  historyList: HistoryWeatherValue["list"];
  unit: string;
};

export default function WeatherPressureSubSection({
  heading,
  pressure,
  historyList,
  unit,
}: WeatherPressureSubSectionProps) {
  const { colors } = useThemeContext();

  return (
    <View style={tw`justify-center items-center`}>
      <Text style={tw`mt-2 mb-1 font-poppinsMedium text-base text-[${colors.textAccent}]`}>
        {heading}
      </Text>

      <View style={tw`flex-row items-baseline`}>
        <Text style={tw`font-poppinsMedium text-3xl text-[${colors.text}]`}>{pressure.value}</Text>
        <Text style={tw`font-poppinsRegular text-xl text-[${colors.textAccent}]`}>
          &nbsp;{unit}
        </Text>
      </View>

      <WeatherChange
        unit={unit}
        currentValue={pressure.value}
        valuesList={historyList}
      />

      <View style={tw`mt-3 flex-row gap-x-4`}>
        <MinMaxValues
          type="max"
          currentValue={pressure}
          valuesList={historyList}
        />

        <MinMaxValues
          type="min"
          currentValue={pressure}
          valuesList={historyList}
        />
      </View>
    </View>
  );
}
