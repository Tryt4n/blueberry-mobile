import { Text } from "react-native";
import { memo } from "react";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import { mapDays } from "@/helpers/weather";
import WeatherForecastDaily from "./WeatherForecastDaily";
import WeatherForecastHourly from "./WeatherForecastHourly";
import Divider from "@/components/Divider";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ForecastWeather } from "@/types/weather";

export type WeatherShortenedForecast = {
  datetime: ForecastWeather["days"][number]["datetime"];
  datetimeEpoch: ForecastWeather["days"][number]["datetimeEpoch"];
  tempmax: ForecastWeather["days"][number]["tempmax"];
  tempmin: ForecastWeather["days"][number]["tempmin"];
  icon: ForecastWeather["days"][number]["icon"];
  conditions: ForecastWeather["days"][number]["conditions"];
  winddir: ForecastWeather["days"][number]["winddir"];
  windspeed: ForecastWeather["days"][number]["windspeed"];
  precip: ForecastWeather["days"][number]["precip"];
  preciptype: ForecastWeather["days"][number]["preciptype"];
  precipprob: ForecastWeather["days"][number]["precipprob"];
  hours?: ForecastHour;
}[];

type ForecastHour = Partial<ForecastWeather["days"][number]["hours"][number]> &
  {
    datetime: ForecastWeather["days"][number]["hours"][number]["datetime"];
    datetimeEpoch: ForecastWeather["days"][number]["hours"][number]["datetimeEpoch"];
    temp: ForecastWeather["days"][number]["hours"][number]["temp"];
    icon: ForecastWeather["days"][number]["hours"][number]["icon"];
    conditions: ForecastWeather["days"][number]["hours"][number]["conditions"];
    windspeed: ForecastWeather["days"][number]["hours"][number]["windspeed"];
    winddir: ForecastWeather["days"][number]["hours"][number]["winddir"];
    precip: ForecastWeather["days"][number]["hours"][number]["precip"];
    preciptype: ForecastWeather["days"][number]["hours"][number]["preciptype"];
    precipprob: ForecastWeather["days"][number]["hours"][number]["precipprob"];
  }[];

function WeatherForecast() {
  const { weatherForecast } = useWeatherContext();

  const shortenedForecast: WeatherShortenedForecast | undefined =
    weatherForecast.data?.days && weatherForecast.data.days.map(mapDays);

  return (
    <>
      {weatherForecast.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {shortenedForecast ? (
            <>
              <WeatherForecastDaily forecast={shortenedForecast} />

              <Divider />

              <WeatherForecastHourly
                forecast={shortenedForecast.slice(0, 3)} // Pass only the first 3 days to avoid rendering too many elements
              />
            </>
          ) : (
            <Text>Nie udało się załadować prognozy pogody</Text>
          )}
        </>
      )}
    </>
  );
}

export default memo(WeatherForecast);
