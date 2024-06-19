import { createContext, useEffect, useState } from "react";
import { useDataFetch } from "@/hooks/useDataFetch";
import { usePathname } from "expo-router";
import {
  getCurrentWeatherData,
  getForecast,
  getWeatherDataHistoryByDate,
} from "@/api/weatherStation/weather";
import { formatDate } from "@/helpers/dates";
import type { CurrentWeather, ForecastWeather, HistoryWeather } from "@/types/weather";

type WeatherContextType = {
  today: Date;
  currentWeather: ReturnType<typeof useDataFetch> & { data?: CurrentWeather };
  currentWeatherData?: CurrentWeather;
  weatherHistory: ReturnType<typeof useDataFetch> & { data?: HistoryWeather };
  weatherForecast: ReturnType<typeof useDataFetch> & { data?: ForecastWeather };
  elapsedTimeFromLastUpdate: number;
};

export const WeatherContext = createContext<WeatherContextType | null>(null);

export default function WeatherContextProvider({ children }: { children: React.ReactNode }) {
  const today = new Date();

  const currentWeather = useDataFetch(getCurrentWeatherData, []);
  const weatherHistory = useDataFetch(
    () =>
      getWeatherDataHistoryByDate(formatDate(today, "yyyy-MM-dd"), formatDate(today, "yyyy-MM-dd")),
    []
  );
  const weatherForecast = useDataFetch(getForecast, []);
  const pathname = usePathname();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeather>();
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Refetch current weather data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      currentWeather.refetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update the current weather only on the weather page and every minute or on the first load
    if (currentWeather.data && pathname === "/weather" && (isFirstLoad || elapsedTime >= 60)) {
      setCurrentWeatherData(currentWeather.data); // Update the current weather data
      setLastUpdated(Date.now()); // Reset the elapsed time
      setIsFirstLoad(false); // Set first load to false after the first data fetch
    }
  }, [currentWeather.data, pathname, isFirstLoad, elapsedTime]);

  // Update the elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - lastUpdated) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const contextValues: WeatherContextType = {
    today,
    currentWeather,
    currentWeatherData,
    weatherHistory,
    weatherForecast,
    elapsedTimeFromLastUpdate: elapsedTime,
  };

  return <WeatherContext.Provider value={contextValues}>{children}</WeatherContext.Provider>;
}
