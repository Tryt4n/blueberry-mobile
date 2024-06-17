import clearDay from "../assets/weather/clear-day.png";
import clearNight from "../assets/weather/clear-night.png";
import cloudy from "../assets/weather/cloudy.png";
import fog from "../assets/weather/fog.png";
import hail from "../assets/weather/hail.png";
import partlyCloudyDay from "../assets/weather/partly-cloudy-day.png";
import partlyCloudyNight from "../assets/weather/partly-cloudy-night.png";
import rain from "../assets/weather/rain.png";
import rainSnow from "../assets/weather/rain-snow.png";
import rainSnowShowersDay from "../assets/weather/rain-snow-showers-day.png";
import rainSnowShowersNight from "../assets/weather/rain-snow-showers-night.png";
import showersDay from "../assets/weather/showers-day.png";
import showersNight from "../assets/weather/showers-night.png";
import sleet from "../assets/weather/sleet.png";
import snow from "../assets/weather/snow.png";
import snowShowersDay from "../assets/weather/snow-showers-day.png";
import snowShowersNight from "../assets/weather/snow-showers-night.png";
import thunder from "../assets/weather/thunder.png";
import thunderRain from "../assets/weather/thunder-rain.png";
import thunderShowersDay from "../assets/weather/thunder-showers-day.png";
import thunderShowersNight from "../assets/weather/thunder-showers-night.png";
import wind from "../assets/weather/wind.png";
import type { ForecastWeather } from "@/types/weather";
import type { ImageSourcePropType } from "react-native";

export const weatherIcons: Record<
  ForecastWeather["currentConditions"]["icon"],
  ImageSourcePropType
> = {
  "clear-day": clearDay,
  "clear-night": clearNight,
  cloudy: cloudy,
  fog: fog,
  hail: hail,
  "partly-cloudy-day": partlyCloudyDay,
  "partly-cloudy-night": partlyCloudyNight,
  rain: rain,
  "rain-snow": rainSnow,
  "rain-snow-showers-day": rainSnowShowersDay,
  "rain-snow-showers-night": rainSnowShowersNight,
  "showers-day": showersDay,
  "showers-night": showersNight,
  sleet: sleet,
  snow: snow,
  "snow-showers-day": snowShowersDay,
  "snow-showers-night": snowShowersNight,
  thunder: thunder,
  "thunder-rain": thunderRain,
  "thunder-showers-day": thunderShowersDay,
  "thunder-showers-night": thunderShowersNight,
  wind: wind,
};
