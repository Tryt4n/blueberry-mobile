import { View, Text, Image } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { isAfter, isThisHour, isToday, startOfHour } from "date-fns";
import { formatDate } from "@/helpers/dates";
import { weatherIcons } from "@/constants/weatherIcons";
import WeatherForecastLayout from "./WeatherForecastLayout";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import type { WeatherShortenedForecast } from "./WeatherForecast";

type WeatherForecastHourlyProps = {
  forecast: WeatherShortenedForecast;
  tempUnit: string;
  windUnit: string;
};

export default function WeatherForecastHourly({
  forecast,
  tempUnit,
  windUnit,
}: WeatherForecastHourlyProps) {
  const { colors } = useThemeContext();

  return (
    <WeatherForecastLayout heading="Prognoza godzinowa">
      {forecast.map((day, dayIndex) => (
        <View
          key={day.datetimeEpoch}
          style={tw`${dayIndex === 0 ? "ml-0" : "mx-4"}`}
        >
          <Text style={tw`font-poppinsRegular text-[${colors.text}] uppercase`}>
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
                  <View
                    key={hour.datetimeEpoch}
                    style={tw`${hourIndex === 0 ? "ml-0 mr-4" : "mx-4"} items-center flex-1`}
                  >
                    <Text style={tw`font-poppinsRegular text-[${colors.text}] uppercase`}>
                      {isThisHour(hour.datetimeEpoch * 1000)
                        ? "Teraz"
                        : formatDate(hour.datetimeEpoch * 1000, "HH")}
                    </Text>

                    <View style={tw`mt-1 flex-row items-baseline`}>
                      <View style={tw`flex-row items-baseline`}>
                        <Text style={tw`font-poppinsSemiBold text-base text-[${colors.text}]`}>
                          {hour.temp}
                        </Text>
                        <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}>
                          &nbsp;{tempUnit}
                        </Text>
                      </View>
                    </View>

                    <View style={tw`items-center max-w-[155px]`}>
                      <Image source={weatherIcons[hour.icon as keyof typeof weatherIcons]} />
                      <Text
                        style={tw`font-poppinsRegular text-xs text-[${colors.textAccent}] text-center`}
                      >
                        {hour.conditions}
                      </Text>
                    </View>

                    <View style={tw`mt-1 flex-row items-center gap-x-1`}>
                      <Ionicons
                        name="arrow-up-circle-outline"
                        size={20}
                        color={colors.textAccent}
                        style={{ transform: [{ rotate: `${hour.winddir}deg` }] }} // rotate arrow icon based on wind direction
                      />
                      <Text style={tw`font-poppinsRegular text-[${colors.textAccent}] text-center`}>
                        {hour.windspeed}
                        {windUnit}
                      </Text>
                    </View>

                    <View style={tw`mt-1 items-center gap-x-1`}>
                      <View style={tw`flex-row items-center`}>
                        <View style={tw`flex-row items-center`}>
                          <Ionicons
                            name={
                              !hour.precip || hour.preciptype?.includes("rain") ? "water" : "snow"
                            } // if no precip or rain, show water icon
                            size={14}
                            color={colors.primary}
                          />
                          {
                            // if precip type is snow, ice or freezing rain, show additional snow icon
                            hour.preciptype?.map((type) => {
                              if (type === "snow" || type === "ice" || type === "freezingrain")
                                return (
                                  <>
                                    <Text style={tw`font-poppinsRegular text-[${colors.primary}]`}>
                                      /
                                    </Text>
                                    <Ionicons
                                      name="snow"
                                      size={14}
                                      color={colors.primary}
                                    />
                                  </>
                                );
                            })
                          }
                        </View>

                        <Text style={tw`font-poppinsRegular text-[${colors.primary}]`}>
                          {hour.precipprob?.toFixed()}%
                        </Text>
                      </View>

                      {hour.precipprob &&
                      hour.precipprob >= 50 &&
                      hour.precip &&
                      hour.precip > 0 ? (
                        <Text style={tw`font-poppinsRegular text-[${colors.primary}]`}>
                          {hour.precip.toFixed(1)}mm
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      ))}
    </WeatherForecastLayout>
  );
}
