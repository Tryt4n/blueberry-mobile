import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useDataFetch } from "@/hooks/useDataFetch";
import {
  getCurrentWeatherData,
  getForecast,
  getWeatherDataHistoryByDate,
} from "@/api/weatherStation/weather";
import { formatDate } from "@/helpers/dates";
import tw from "@/lib/twrnc";
import currentWeather from "@/weatherPlaceholder/real-time-data-all.json";
import weatherHistory from "@/weatherPlaceholder/history-time-data-all.json";
import weatherForecast from "@/weatherPlaceholder/forecast.json";
import LoadingSpinner from "@/components/LoadingSpinner";
import MinMaxValues from "@/components/Weather/MinMaxValues";
import WeatherChange from "@/components/Weather/WeatherChange";
import { Entypo } from "@expo/vector-icons";
import Divider from "@/components/Divider";

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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <View style={tw`my-8`}>
          <Text>Pogoda</Text>

          <View style={tw`justify-center items-center`}>
            <Text>Temperatura</Text>

            <Text>
              {currentWeather.outdoor.temperature.value}
              {currentWeather.outdoor.temperature.unit}
            </Text>

            <WeatherChange
              unit={currentWeather.outdoor.temperature.unit}
              currentValue={currentWeather.outdoor.temperature.value}
              valuesList={weatherHistory.outdoor.temperature.list}
            />

            <View style={tw`flex-row gap-x-4`}>
              <MinMaxValues
                type="max"
                currentValue={currentWeather.outdoor.temperature}
                valuesList={weatherHistory.outdoor.temperature.list}
              />

              <MinMaxValues
                type="min"
                currentValue={currentWeather.outdoor.temperature}
                valuesList={weatherHistory.outdoor.temperature.list}
              />
            </View>
          </View>

          <Divider />

          <View style={tw`justify-center items-center`}>
            <Text>Odczuwalne</Text>

            <Text>
              {currentWeather.outdoor.feels_like.value}
              {currentWeather.outdoor.feels_like.unit}
            </Text>

            <WeatherChange
              unit={currentWeather.outdoor.feels_like.unit}
              currentValue={currentWeather.outdoor.feels_like.value}
              valuesList={weatherHistory.outdoor.feels_like.list}
            />

            <View style={tw`flex-row gap-x-4`}>
              <MinMaxValues
                type="max"
                currentValue={currentWeather.outdoor.feels_like}
                valuesList={weatherHistory.outdoor.feels_like.list}
              />

              <MinMaxValues
                type="min"
                currentValue={currentWeather.outdoor.feels_like}
                valuesList={weatherHistory.outdoor.feels_like.list}
              />
            </View>
          </View>

          <Divider />

          <View style={tw`justify-center items-center`}>
            <Text>Wilgotność</Text>

            <Text>
              {currentWeather.outdoor.humidity.value}
              {currentWeather.outdoor.humidity.unit}
            </Text>

            <WeatherChange
              unit={currentWeather.outdoor.humidity.unit}
              currentValue={currentWeather.outdoor.humidity.value}
              valuesList={weatherHistory.outdoor.humidity.list}
            />

            <View style={tw`flex-row gap-x-4`}>
              <MinMaxValues
                type="max"
                currentValue={currentWeather.outdoor.humidity}
                valuesList={weatherHistory.outdoor.humidity.list}
              />

              <MinMaxValues
                type="min"
                currentValue={currentWeather.outdoor.humidity}
                valuesList={weatherHistory.outdoor.humidity.list}
              />
            </View>
          </View>

          <Divider />

          <View style={tw`justify-center items-center`}>
            <Text>Opady</Text>

            <Text>
              Aktualny opad: {currentWeather.rainfall.rain_rate.value}&nbsp;
              {currentWeather.rainfall.rain_rate.unit}
            </Text>

            <Text>
              Dzienny opad: {currentWeather.rainfall.daily.value}&nbsp;
              {currentWeather.rainfall.daily.unit}
            </Text>

            <Text>
              Od rozpoczęcia opadu: {currentWeather.rainfall.event.value}&nbsp;
              {currentWeather.rainfall.event.unit}
            </Text>

            <Text>
              Godzinowo: {currentWeather.rainfall.hourly.value}&nbsp;
              {currentWeather.rainfall.hourly.unit}
            </Text>

            <Text>
              Tygodniowo: {currentWeather.rainfall.weekly.value}&nbsp;
              {currentWeather.rainfall.weekly.unit}
            </Text>

            <Text>
              Miesięcznie: {currentWeather.rainfall.monthly.value}&nbsp;
              {currentWeather.rainfall.monthly.unit}
            </Text>

            <Text>
              Rocznie: {currentWeather.rainfall.yearly.value}&nbsp;
              {currentWeather.rainfall.yearly.unit}
            </Text>
          </View>

          <Divider />

          <View style={tw`justify-center items-center`}>
            <Text>Wiatr</Text>

            <View style={tw`justify-center items-center`}>
              <View>
                <Text>
                  Prędkość wiatru: {currentWeather.wind.wind_speed.value}&nbsp;
                  {currentWeather.wind.wind_speed.unit}
                </Text>

                <MinMaxValues
                  type="max"
                  currentValue={currentWeather.wind.wind_speed}
                  valuesList={weatherHistory.wind.wind_speed.list}
                />
              </View>

              <View
                style={tw`relative w-32 h-32 bg-transparent border rounded-full justify-center items-center`}
              >
                {[...Array(72)].map((_, i) => (
                  <View
                    key={i}
                    style={{
                      ...tw`absolute w-0.5 h-1.5 bg-black`,
                      transform: `rotate(${i * 5}deg) translateY(-58px)`,
                    }}
                  />
                ))}
                <Entypo
                  name="arrow-long-down"
                  size={20}
                  style={{
                    ...tw`absolute right-0 top-0`,
                    transform: `rotate(${currentWeather.wind.wind_direction.value}deg)`,
                  }}
                />
                <View style={tw`justify-center items-center`}>
                  <Text>
                    {currentWeather.wind.wind_direction.value}&nbsp;
                    {currentWeather.wind.wind_direction.unit}
                  </Text>
                  <Text>Direction</Text>
                </View>
              </View>

              <View>
                <Text>
                  Porywy wiatru: {currentWeather.wind.wind_gust.value}&nbsp;
                  {currentWeather.wind.wind_gust.unit}
                </Text>

                <MinMaxValues
                  type="max"
                  currentValue={currentWeather.wind.wind_gust}
                  valuesList={weatherHistory.wind.wind_gust.list}
                />
              </View>
            </View>
          </View>

          <Divider />

          <View style={tw`justify-center items-center`}>
            <Text>Ciśnienie</Text>

            <View style={tw`justify-center items-center flex-row gap-x-8`}>
              <View style={tw`justify-center items-center`}>
                <Text>Względne</Text>

                <Text>
                  {currentWeather.pressure.relative.value} {currentWeather.pressure.relative.unit}
                </Text>

                <WeatherChange
                  unit={currentWeather.pressure.relative.unit}
                  currentValue={currentWeather.pressure.relative.value}
                  valuesList={weatherHistory.pressure.relative.list}
                />

                <View>
                  <MinMaxValues
                    type="max"
                    currentValue={currentWeather.pressure.relative}
                    valuesList={weatherHistory.pressure.relative.list}
                  />

                  <MinMaxValues
                    type="min"
                    currentValue={currentWeather.pressure.relative}
                    valuesList={weatherHistory.pressure.relative.list}
                  />
                </View>
              </View>

              <View style={tw`justify-center items-center`}>
                <Text>Bezwzględne</Text>

                <Text>
                  {currentWeather.pressure.absolute.value} {currentWeather.pressure.absolute.unit}
                </Text>

                <WeatherChange
                  unit={currentWeather.pressure.absolute.unit}
                  currentValue={currentWeather.pressure.absolute.value}
                  valuesList={weatherHistory.pressure.absolute.list}
                />

                <View>
                  <MinMaxValues
                    type="max"
                    currentValue={currentWeather.pressure.absolute}
                    valuesList={weatherHistory.pressure.absolute.list}
                  />

                  <MinMaxValues
                    type="min"
                    currentValue={currentWeather.pressure.absolute}
                    valuesList={weatherHistory.pressure.absolute.list}
                  />
                </View>
              </View>
            </View>
          </View>

          <Divider />

          <View style={tw`justify-center items-center`}>
            <Text>Słońce</Text>

            <Text>
              Index UV: {currentWeather.solar_and_uvi.uvi.value}&nbsp;
              {currentWeather.solar_and_uvi.uvi.unit}
            </Text>

            <Text>
              Nasłonecznienie: {currentWeather.solar_and_uvi.solar.value}&nbsp;
              {currentWeather.solar_and_uvi.solar.unit}
            </Text>

            <Text>
              Wschód słońca: {formatDate(weatherForecast.days[1].sunriseEpoch * 1000, "HH:mm")}
            </Text>
            <Text>
              Zachód słońca: {formatDate(weatherForecast.days[1].sunsetEpoch * 1000, "HH:mm")}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
