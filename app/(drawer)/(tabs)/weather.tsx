import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useDataFetch } from "@/hooks/useDataFetch";
import {
  getCurrentWeatherData,
  getForecast,
  getWeatherDataHistoryByDate,
} from "@/api/weatherStation/weather";
import tw from "@/lib/twrnc";
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
import Divider from "@/components/Divider";
import WeatherChange from "@/components/Weather/WeatherChange";
import MinMaxValues from "@/components/Weather/MinMaxValues";

export default function TabsWeather() {
  const { colors } = useThemeContext();
  // const {
  //   data: currentWeather,
  //   isLoading: isLoadingCurrent,
  //   refetchData: refetchCurrentWeather,
  // } = useDataFetch(getCurrentWeatherData, []);
  // const { data: weatherHistory, isLoading: isLoadingHistory } = useDataFetch(
  //   () => getWeatherDataHistoryByDate("2024-06-13", "2024-06-13"),
  //   []
  // );
  // const { data: weatherForecast, isLoading: isLoadingWeatherForecast } = useDataFetch(
  //   getForecast,
  //   []
  // );

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetchCurrentWeather();
  //     console.log("Refetching weather data");
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, []);

  // const isLoading = isLoadingCurrent || isLoadingHistory || isLoadingWeatherForecast;
  const isLoading = false; //?

  return (
    <ScrollView>
      <PageLayout containerStyles="my-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Text style={tw`font-poppinsBold text-3xl text-[${colors.text}]`}>Pogoda</Text>

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

                {weatherForecast && (
                  <WeatherSolarSection
                    currentSolar={currentWeather.solar_and_uvi}
                    historySolar={weatherHistory.solar_and_uvi}
                    astronomicValues={{
                      sunrise: weatherForecast.days[1].sunrise,
                      sunset: weatherForecast.days[1].sunset,
                    }}
                  />
                )}
              </>
            ) : (
              <Text
                style={tw`my-8 font-poppinsSemiBold text-base text-center text-[${colors.textAccent}]`}
              >
                Nie udało się pobrać aktualnej pogody.
              </Text>
            )}
          </>
        )}
      </PageLayout>
    </ScrollView>
  );
}
