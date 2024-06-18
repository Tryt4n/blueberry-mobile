import { View, Text, Image } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { formatDate } from "@/helpers/dates";
import { isToday } from "date-fns/isToday";
import { weatherIcons } from "@/constants/weatherIcons";
import { Ionicons } from "@expo/vector-icons";
import WeatherForecastLayout from "./WeatherForecastLayout";
import { FlashList } from "@shopify/flash-list";
import type { WeatherShortenedForecast } from "./WeatherForecast";

type WeatherForecastDailyProps = {
  forecast: WeatherShortenedForecast;
  tempUnit: string;
  windUnit: string;
};

export default function WeatherForecastDaily({
  forecast,
  tempUnit,
  windUnit,
}: WeatherForecastDailyProps) {
  const { colors } = useThemeContext();

  return (
    <WeatherForecastLayout heading="Prognoza dzienna">
      <FlashList
        horizontal
        data={forecast}
        keyExtractor={(item) => item.datetimeEpoch.toString()}
        estimatedItemSize={forecast.length}
        renderItem={({ item: day, index }) => (
          <View
            key={day.datetimeEpoch}
            style={tw`${index === 0 ? "ml-0" : "ml-8"} items-center flex-1`}
          >
            <Text style={tw`font-poppinsRegular text-[${colors.text}] uppercase`}>
              {isToday(day.datetime) ? "Dzisiaj" : formatDate(day.datetime, "EE dd")}
            </Text>

            <View style={tw`mt-1 flex-row items-baseline`}>
              <View style={tw`flex-row items-baseline`}>
                <Text style={tw`font-poppinsSemiBold text-base text-[${colors.text}]`}>
                  {day.tempmax}
                </Text>
                <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}>
                  &nbsp;{tempUnit}
                </Text>
              </View>

              <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}> | </Text>

              <View style={tw`flex-row items-baseline`}>
                <Text style={tw`font-poppinsSemiBold text-base text-[${colors.text}]`}>
                  {day.tempmin}
                </Text>
                <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}>
                  &nbsp;{tempUnit}
                </Text>
              </View>
            </View>

            <View style={tw`items-center max-w-[155px]`}>
              <Image source={weatherIcons[day.icon as keyof typeof weatherIcons]} />
              <Text style={tw`font-poppinsRegular text-xs text-[${colors.textAccent}] text-center`}>
                {day.conditions}
              </Text>
            </View>

            <View style={tw`mt-1 flex-row items-center gap-x-1`}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={20}
                color={colors.textAccent}
                style={{ transform: [{ rotate: `${day.winddir}deg` }] }} // rotate arrow icon based on wind direction
              />
              <Text style={tw`font-poppinsRegular text-[${colors.textAccent}] text-center`}>
                {day.windspeed}
                {windUnit}
              </Text>
            </View>

            <View style={tw`mt-1 items-center gap-x-1`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`flex-row items-center`}>
                  <Ionicons
                    name={!day.precip || day.preciptype?.includes("rain") ? "water" : "snow"} // if no precip or rain, show water icon
                    size={14}
                    color={colors.primary}
                  />
                  {
                    // if precip type is snow, ice or freezing rain, show additional snow icon
                    day.preciptype?.map((type) => {
                      if (type === "snow" || type === "ice" || type === "freezingrain")
                        return (
                          <>
                            <Text style={tw`font-poppinsRegular text-[${colors.primary}]`}>/</Text>
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
                  {day.precipprob.toFixed()}%
                </Text>
              </View>

              {day.precipprob >= 50 && day.precip > 0 && (
                <Text style={tw`font-poppinsRegular text-[${colors.primary}]`}>
                  {day.precip.toFixed(1)}mm
                </Text>
              )}
            </View>
          </View>
        )}
      />
    </WeatherForecastLayout>
  );
}
