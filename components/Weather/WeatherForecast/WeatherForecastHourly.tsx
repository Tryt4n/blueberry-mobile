import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { isAfter, isThisHour, isToday, startOfHour } from "date-fns";
import { formatDate } from "@/helpers/dates";
import { FlashList } from "@shopify/flash-list";
import WeatherForecastLayout from "./WeatherForecastLayout";
import WeatherForecastListItem from "./WeatherForecastListItem";
import type { WeatherShortenedForecast } from "./WeatherForecast";

export default function WeatherForecastHourly({
  forecast,
}: {
  forecast: WeatherShortenedForecast;
}) {
  const { colors } = useThemeContext();

  return (
    <WeatherForecastLayout heading="Prognoza godzinowa">
      {forecast.map((day, dayIndex) => (
        <View
          key={day.datetimeEpoch}
          style={tw`${dayIndex === 0 ? "ml-0" : "mx-4"}`}
        >
          <Text style={tw`mb-1 font-poppinsMedium text-base text-[${colors.text}] uppercase`}>
            {isToday(day.datetime) ? "Dzisiaj" : formatDate(day.datetime, "EE dd")}
          </Text>

          {day.hours && day.hours.length > 0 && (
            <View
              style={tw`flex-row h-[228px]${
                // Exclude last child with hours
                dayIndex !== forecast.length - 1 ? ` border-r border-[${colors.border}]` : ""
              }`}
            >
              <FlashList
                horizontal
                data={day.hours.filter((hour) => {
                  return !isAfter(startOfHour(new Date()), new Date(hour.datetimeEpoch * 1000));
                })}
                keyExtractor={(item) => item.datetimeEpoch.toString()}
                estimatedItemSize={day.hours.length}
                renderItem={({ item: hour, index: hourIndex }) => (
                  <WeatherForecastListItem
                    data={
                      {
                        ...hour,
                        tempmax: hour.temp,
                        tempmin: hour.temp,
                      } as WeatherShortenedForecast[number]
                    }
                    index={hourIndex}
                    currentText={
                      isThisHour(hour.datetimeEpoch * 1000)
                        ? "Teraz"
                        : formatDate(hour.datetimeEpoch * 1000, "HH")
                    }
                  />
                )}
              />
            </View>
          )}
        </View>
      ))}
    </WeatherForecastLayout>
  );
}
