import { Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { usePathname } from "expo-router";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import { useDataFetch } from "@/hooks/useDataFetch";
import {
  getCurrentWeatherData,
  getForecast,
  getWeatherDataHistoryByDate,
} from "@/api/weatherStation/weather";
import tw from "@/lib/twrnc";
import { formatDate } from "@/helpers/dates";
import currentWeather from "@/weatherPlaceholder/real-time-data-all.json";
import weatherHistory from "@/weatherPlaceholder/history-time-data-all.json";
import weatherForecast from "@/weatherPlaceholder/forecast.json";
import PageLayout from "@/layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import WeatherTemperatureSection from "@/components/Weather/WeatherTemperatureSection";
import WeatherRainfallSection from "@/components/Weather/WeatherRainfallSection";
import WeatherWindSection from "@/components/Weather/WeatherWindSection";
import WeatherPressureSection from "@/components/Weather/WeatherPressureSection";
import WeatherSolarSection from "@/components/Weather/WeatherSolarSection";
import WeatherForecast from "@/components/Weather/WeatherForecast/WeatherForecast";
import Divider from "@/components/Divider";
import type { CurrentWeather, ForecastWeather } from "@/types/weather";

export default function TabsWeather() {
  const { colors } = useThemeContext();
  const { today } = useWeatherContext();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>();
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const pathname = usePathname();

  // Fetch all weather data
  const {
    data: currentWeatherData,
    isLoading: isLoadingCurrent,
    refetchData: refetchCurrentWeather,
  } = useDataFetch(getCurrentWeatherData, []);
  const { data: weatherHistory, isLoading: isLoadingHistory } = useDataFetch(
    () =>
      getWeatherDataHistoryByDate(formatDate(today, "yyyy-MM-dd"), formatDate(today, "yyyy-MM-dd")),
    []
  );
  const { data: weatherForecast, isLoading: isLoadingWeatherForecast } = useDataFetch(
    getForecast,
    []
  );

  // Refetch current weather data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCurrentWeather();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update the current weather only on the weather page and every minute or on the first load
    if (currentWeatherData && pathname === "/weather" && (isFirstLoad || elapsedTime >= 60)) {
      setCurrentWeather(currentWeatherData); // Update the current weather data
      setLastUpdated(Date.now()); // Reset the elapsed time
      setIsFirstLoad(false); // Set first load to false after the first data fetch
    }
  }, [currentWeatherData, pathname, isFirstLoad, elapsedTime]);

  // Update the elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - lastUpdated) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const isLoading =
    (isLoadingCurrent || isLoadingHistory || isLoadingWeatherForecast) &&
    !currentWeather &&
    !weatherHistory;
  // const isLoading = false; // Placeholder

  return (
    <ScrollView>
      <PageLayout containerStyles="my-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Text style={tw`font-poppinsBold text-3xl text-[${colors.text}]`}>Pogoda</Text>

            <Text style={tw`mt-2 font-poppinsLight text-xs text-[${colors.textAccent}]`}>
              Zaktualizowano {elapsedTime} sekund
              {elapsedTime === 1 ? "ę" : elapsedTime >= 2 && elapsedTime <= 4 ? "y" : ""} temu
            </Text>

            {currentWeather && weatherHistory ? (
              <>
                <WeatherTemperatureSection
                  heading="Temperatura"
                  currentTemp={currentWeather.outdoor.temperature}
                  historyTempList={weatherHistory.outdoor.temperature.list}
                  unit={currentWeather.outdoor.temperature.unit}
                />

                <Divider />

                <WeatherTemperatureSection
                  heading="Odczuwalna"
                  currentTemp={currentWeather.outdoor.feels_like}
                  historyTempList={weatherHistory.outdoor.feels_like.list}
                  unit={currentWeather.outdoor.feels_like.unit}
                />

                <Divider />

                <WeatherTemperatureSection
                  heading="Wilgotność"
                  currentTemp={currentWeather.outdoor.humidity}
                  historyTempList={weatherHistory.outdoor.humidity.list}
                  unit={currentWeather.outdoor.humidity.unit}
                />

                <Divider />

                <WeatherRainfallSection currentRainfall={currentWeather.rainfall} />

                <Divider />

                <WeatherWindSection
                  currentWind={currentWeather.wind}
                  historyWind={weatherHistory.wind}
                />

                <Divider />

                <WeatherPressureSection
                  currentPressure={currentWeather.pressure}
                  historyPressure={weatherHistory.pressure}
                />

                <Divider />

                <WeatherSolarSection
                  currentSolar={currentWeather.solar_and_uvi}
                  historySolar={weatherHistory.solar_and_uvi}
                  astronomicValues={
                    weatherForecast && {
                      sunrise: weatherForecast.days[1].sunrise,
                      sunset: weatherForecast.days[1].sunset,
                    }
                  }
                />

                {weatherForecast && (
                  <>
                    <Divider />

                    <WeatherForecast
                      forecast={weatherForecast.days as ForecastWeather["days"]}
                      tempUnit={currentWeather.outdoor.temperature.unit}
                      windUnit={currentWeather.wind.wind_speed.unit}
                    />
                  </>
                )}
              </>
            ) : (
              <Text
                style={tw`my-8 font-poppinsSemiBold text-base text-center text-[${colors.textAccent}]`}
              >
                {currentWeather && weatherHistory ? "Nie udało się pobrać aktualnej pogody." : ""}
              </Text>
            )}
          </>
        )}
      </PageLayout>
    </ScrollView>
  );
}
