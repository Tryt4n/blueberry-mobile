import { Text, ScrollView } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import tw from "@/lib/twrnc";
import PageLayout from "@/layout/PageLayout";
import WeatherTemperatureSection from "./WeatherTemperatureSection";
import WeatherRainfallSection from "./WeatherRainfallSection";
import WeatherWindSection from "./WeatherWindSection";
import WeatherPressureSection from "./WeatherPressureSection";
import WeatherSolarSection from "./WeatherSolarSection";
import WeatherForecast from "./WeatherForecast/WeatherForecast";
import LoadingSpinner from "../LoadingSpinner";
import Divider from "../Divider";

export default function Weather() {
  const { colors } = useThemeContext();
  const {
    currentWeather,
    currentWeatherData,
    weatherHistory,
    weatherForecast,
    elapsedTimeFromLastUpdate,
  } = useWeatherContext();

  const isLoading =
    (currentWeather.isLoading || weatherHistory.isLoading) &&
    !currentWeatherData &&
    !weatherHistory.data;

  return (
    <ScrollView>
      <PageLayout containerStyles="my-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Text style={tw`font-poppinsBold text-3xl text-[${colors.text}]`}>Pogoda</Text>

            <Text style={tw`mt-2 font-poppinsLight text-xs text-[${colors.textAccent}]`}>
              Zaktualizowano {elapsedTimeFromLastUpdate} sekund
              {elapsedTimeFromLastUpdate === 1
                ? "ę"
                : elapsedTimeFromLastUpdate >= 2 && elapsedTimeFromLastUpdate <= 4
                ? "y"
                : ""}
              &nbsp;temu
            </Text>

            {currentWeatherData && weatherHistory.data ? (
              <>
                <WeatherTemperatureSection
                  heading="Temperatura"
                  currentTemp={currentWeatherData.outdoor.temperature}
                  historyTempList={weatherHistory.data.outdoor.temperature.list}
                  unit={currentWeatherData.outdoor.temperature.unit}
                />

                <Divider />

                <WeatherTemperatureSection
                  heading="Odczuwalna"
                  currentTemp={currentWeatherData.outdoor.feels_like}
                  historyTempList={weatherHistory.data.outdoor.feels_like.list}
                  unit={currentWeatherData.outdoor.feels_like.unit}
                />

                <Divider />

                <WeatherTemperatureSection
                  heading="Wilgotność"
                  currentTemp={currentWeatherData.outdoor.humidity}
                  historyTempList={weatherHistory.data.outdoor.humidity.list}
                  unit={currentWeatherData.outdoor.humidity.unit}
                />

                <Divider />

                <WeatherRainfallSection currentRainfall={currentWeatherData.rainfall} />

                <Divider />

                <WeatherWindSection
                  currentWind={currentWeatherData.wind}
                  historyWind={weatherHistory.data.wind}
                />

                <Divider />

                <WeatherPressureSection
                  currentPressure={currentWeatherData.pressure}
                  historyPressure={weatherHistory.data.pressure}
                />

                <Divider />

                <WeatherSolarSection
                  currentSolar={currentWeatherData.solar_and_uvi}
                  historySolar={weatherHistory.data.solar_and_uvi}
                  astronomicValues={
                    weatherForecast.data && {
                      sunrise: weatherForecast.data.days[1].sunrise,
                      sunset: weatherForecast.data.days[1].sunset,
                    }
                  }
                />

                <Divider />

                <WeatherForecast />
              </>
            ) : (
              <Text
                style={tw`my-8 font-poppinsSemiBold text-base text-center text-[${colors.textAccent}]`}
              >
                {!currentWeatherData && !weatherHistory
                  ? "Nie udało się pobrać aktualnej pogody."
                  : ""}
              </Text>
            )}
          </>
        )}
      </PageLayout>
    </ScrollView>
  );
}
