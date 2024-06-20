import { parsedEnv } from "@/lib/zod/env";

const weatherConfig = {
  appKey: parsedEnv.EXPO_PUBLIC_WEATHER_APP_KEY, //! For mobile
  apiKey: parsedEnv.EXPO_PUBLIC_WEATHER_API_KEY, //! For mobile
  weatherStationMacAddress: parsedEnv.EXPO_PUBLIC_WEATHER_STATION_MAC_ADDRESS, //! For mobile
  forecastApiKey: parsedEnv.EXPO_PUBLIC_FORECAST_API_KEY, //! For mobile
  // appKey: process.env.EXPO_PUBLIC_WEATHER_APP_KEY, //! For netlify deploy
  // apiKey: process.env.EXPO_PUBLIC_WEATHER_API_KEY, //! For netlify deploy
  // weatherStationMacAddress: process.env.EXPO_PUBLIC_WEATHER_STATION_MAC_ADDRESS, //! For netlify deploy
  // forecastApiKey: process.env.EXPO_PUBLIC_FORECAST_API_KEY, //! For netlify deploy
  callBack: ["outdoor", "pressure", "rainfall", "wind", "solar_and_uvi"], // outdoor, indoor, pressure, rainfall, wind, solar_and_uvi, battery
  tempUnit: 1, // 1 = Celsius, 2 = Fahrenheit
  pressureUnit: 3, // 3 = hPa, 4 = inHg, 5 = mmHg
  windUnit: 7, // 6 = m/s, 7 = km/h, 8 = knots, 9 = mph, 10 = BFT, 11 = fpm
  rainfallUnit: 12, // 12 = mm, 13 = in
  solarUnit: 16, // 14 - lux, 15 - fc, 16 = W/m²
} as const;

const baseWeatherApiUrl = "https://api.ecowitt.net/api/v3/device";
const callBackOptionsUrl = `call_back=${weatherConfig.callBack}&temp_unitid=${weatherConfig.tempUnit}&pressure_unitid=${weatherConfig.pressureUnit}&wind_speed_unitid=${weatherConfig.windUnit}&rainfall_unitid=${weatherConfig.rainfallUnit}&solar_irradiance_unitid=${weatherConfig.solarUnit}`;

export { weatherConfig, baseWeatherApiUrl, callBackOptionsUrl };
