import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import { subHours } from "date-fns/subHours";
import tw from "@/lib/twrnc";
import { FontAwesome6 } from "@expo/vector-icons";
import type { CurrentWeatherValue, HistoryWeatherValue } from "@/types/weather";

export default function WeatherChange({
  currentValue,
  valuesList,
  unit,
}: {
  currentValue: CurrentWeatherValue["value"];
  valuesList: HistoryWeatherValue["list"];
  unit: CurrentWeatherValue["unit"];
}) {
  const { colors } = useThemeContext();
  const { today } = useWeatherContext();

  // Calculate timestamp for an hour ago
  const oneHourAgo = subHours(today, 1);
  const oneHourAgoTimestamp = Math.floor(oneHourAgo.getTime() / 1000);

  // Find the closest record to an hour ago
  const closestTimestamp = Object.keys(valuesList).reduce((prev, curr) =>
    Math.abs(Number(curr) - oneHourAgoTimestamp) < Math.abs(Number(prev) - oneHourAgoTimestamp)
      ? curr
      : prev
  );

  // Calculate the temperature change in the last hour
  const valueChange = parseFloat(
    (Number(currentValue) - Number(valuesList[closestTimestamp])).toFixed(2)
  );

  return (
    <View style={tw`flex flex-row gap-x-2`}>
      <FontAwesome6
        name={Number(valueChange) >= 0 ? "arrow-trend-up" : "arrow-trend-down"}
        size={16}
        color={Number(valueChange) >= 0 ? colors.danger : colors.primary}
      />

      <Text style={tw`text-base font-poppinsMedium text-[${colors.textAccent}]`}>
        {valueChange}
        <Text style={tw`text-sm font-poppinsRegular text-[${colors.text}`}>&nbsp;{unit}/hr</Text>
      </Text>
    </View>
  );
}
