import { View, Text, Image } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import tw from "@/lib/twrnc";
import { weatherIcons } from "@/constants/weatherIcons";
import { Ionicons } from "@expo/vector-icons";
import type { WeatherShortenedForecast } from "./WeatherForecast";

type WeatherForecastListItemProps = {
  data: WeatherShortenedForecast[number];
  index: number;
  currentText: string;
};

export default function WeatherForecastListItem({
  data,
  index,
  currentText,
}: WeatherForecastListItemProps) {
  const { colors } = useThemeContext();
  const { currentWeather } = useWeatherContext();

  return (
    <View
      key={data.datetimeEpoch}
      style={tw`${index === 0 ? "ml-0 mr-4" : "mx-4"} items-center flex-1`}
    >
      <Text style={tw`font-poppinsRegular text-[${colors.text}] uppercase`}>{currentText}</Text>

      <View style={tw`mt-1 flex-row items-baseline`}>
        <View style={tw`flex-row items-baseline`}>
          <Text style={tw`font-poppinsSemiBold text-base text-[${colors.text}]`}>
            {data.tempmax}
          </Text>
          <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}>
            &nbsp;{currentWeather.data?.outdoor.temperature.unit || "℃"}
          </Text>
        </View>

        {data.tempmax !== data.tempmin && (
          <>
            <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}> | </Text>

            <View style={tw`flex-row items-baseline`}>
              <Text style={tw`font-poppinsSemiBold text-base text-[${colors.text}]`}>
                {data.tempmin}
              </Text>
              <Text style={tw`font-poppinsRegular text-base text-[${colors.textAccent}]`}>
                &nbsp;{currentWeather.data?.outdoor.temperature.unit || "℃"}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={tw`items-center max-w-[155px]`}>
        <Image source={weatherIcons[data.icon as keyof typeof weatherIcons]} />
        <Text style={tw`font-poppinsRegular text-xs text-[${colors.textAccent}] text-center`}>
          {data.conditions}
        </Text>
      </View>

      <View style={tw`mt-1 flex-row items-center gap-x-1`}>
        <Ionicons
          name="arrow-up-circle-outline"
          size={20}
          color={colors.textAccent}
          style={{ transform: [{ rotate: `${data.winddir}deg` }] }} // rotate arrow icon based on wind direction
        />
        <Text style={tw`font-poppinsRegular text-[${colors.textAccent}] text-center`}>
          {data.windspeed}
          {currentWeather.data?.wind.wind_speed.unit || "km/h"}
        </Text>
      </View>

      <View style={tw`mt-1 items-center gap-x-1`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`flex-row items-center`}>
            <Ionicons
              name={!data.precip || data.preciptype?.includes("rain") ? "water" : "snow"} // If no precip or rain, show water icon
              size={14}
              color={colors.primary}
            />
            {
              // If precip type is snow, ice or freezing rain, show additional snow icon
              data.preciptype?.map((type) => {
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
            {data.precipprob.toFixed()}%
          </Text>
        </View>

        {data.precipprob >= 50 && data.precip > 0 && (
          <Text style={tw`font-poppinsRegular text-[${colors.primary}]`}>
            {data.precip.toFixed(1)}mm
          </Text>
        )}
      </View>
    </View>
  );
}
