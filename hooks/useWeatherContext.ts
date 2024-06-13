import { useContext } from "react";
import { WeatherContext } from "@/context/WeatherContext";

export function useWeatherContext() {
  const weatherContext = useContext(WeatherContext);

  if (!weatherContext) {
    throw new Error("useWeatherContext must be used within a WeatherContextProvider");
  }

  return weatherContext;
}
