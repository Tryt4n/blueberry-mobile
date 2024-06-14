import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import { findExtremeValue } from "@/helpers/weather";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import { formatDate } from "@/helpers/dates";
import tw from "@/lib/twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { CurrentWeatherValue, HistoryWeatherValue } from "@/types/weather";

export default function MinMaxValues({
  currentValue,
  valuesList,
  type,
}: {
  currentValue: CurrentWeatherValue;
  valuesList: HistoryWeatherValue["list"];
  type: "min" | "max";
}) {
  const { colors } = useThemeContext();
  const { today } = useWeatherContext();
  const { extremeValue, extremeValueTime } = findExtremeValue(valuesList, type);

  const extremeTempDate = new Date(Number(extremeValueTime) * 1000); // Unix timestamp to Date. Multiply by 1000 to convert to milliseconds
  const timeDifference = differenceInMinutes(today, extremeTempDate);

  // Compare currentValue.value with extremeValue
  const isCurrentValueExtreme =
    type === "max"
      ? Number(currentValue.value) > Number(extremeValue)
      : Number(currentValue.value) < Number(extremeValue);

  // Choose which value and time to display
  const displayValue = isCurrentValueExtreme ? currentValue.value : extremeValue;

  return (
    <View style={tw`items-center`}>
      <View style={tw`flex flex-row items-center`}>
        <MaterialCommunityIcons
          name={type === "max" ? "arrow-collapse-up" : "arrow-collapse-down"}
          size={16}
          color={type === "max" ? colors.danger : colors.primary}
          style={tw`mr-0.5`}
        />

        <Text style={tw`font-poppinsRegular text-[${colors.textAccent}]`}>
          <Text style={tw`capitalize`}>{type}&nbsp;</Text>
          <Text style={tw`font-poppinsMedium text-base text-[${colors.text}]`}>{displayValue}</Text>
          &nbsp;{currentValue.unit}
        </Text>
      </View>

      <Text style={tw`font-poppinsRegular text-[${colors.textAccent}]`}>
        {timeDifference <= 15 ? "Teraz" : formatDate(extremeTempDate, "HH:mm")}
      </Text>
    </View>
  );
}
