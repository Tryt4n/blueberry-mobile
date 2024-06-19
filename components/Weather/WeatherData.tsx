import { Text } from "react-native";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import WeatherTemperatureSection from "./WeatherTemperatureSection";
import WeatherRainfallSection from "./WeatherRainfallSection";
import WeatherWindSection from "./WeatherWindSection";
import WeatherPressureSection from "./WeatherPressureSection";
import WeatherForecast from "./WeatherForecast/WeatherForecast";
import WeatherSolarSection from "./WeatherSolarSection";
import Divider from "../Divider";

export default function WeatherData() {
  const { colors } = useThemeContext();
  const { currentWeatherData, weatherHistory, weatherForecast } = useWeatherContext();

  return (
    <>
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
          {!currentWeatherData && !weatherHistory ? "Nie udało się pobrać aktualnej pogody." : ""}
        </Text>
      )}
    </>
  );
}
