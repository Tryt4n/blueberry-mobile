import { View, Text } from "react-native";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import { subHours } from "date-fns/subHours";
import tw from "@/lib/twrnc";
import { FontAwesome6 } from "@expo/vector-icons";

export default function WeatherChange({
  currentValue,
  valuesList,
  unit,
}: {
  currentValue: string;
  valuesList: Record<string, string>;
  unit: string;
}) {
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
      />

      <Text>
        {valueChange} {unit}/hr
      </Text>
    </View>
  );
}
