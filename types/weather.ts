export type CurrentWeather = {
  outdoor: CurrentOutdoor;
  wind: CurrentWind;
  rainfall: CurrentRainfall;
  pressure: CurrentPressure;
  solar_and_uvi: CurrentSolarAndUvi;
};

export type HistoryWeather = {
  [K in keyof CurrentWeather]: {
    [J in keyof CurrentWeather[K]]: HistoryWeatherValue;
  };
};

type CurrentOutdoor = {
  temperature: CurrentWeatherValue;
  feels_like: CurrentWeatherValue;
  app_temp: CurrentWeatherValue;
  dew_point: CurrentWeatherValue;
  humidity: CurrentWeatherValue;
};

type CurrentWind = {
  wind_speed: CurrentWeatherValue;
  wind_gust: CurrentWeatherValue;
  wind_direction: CurrentWeatherValue;
};

type CurrentRainfall = {
  rain_rate: CurrentWeatherValue;
  daily: CurrentWeatherValue;
  event: CurrentWeatherValue;
  hourly: CurrentWeatherValue;
  weekly: CurrentWeatherValue;
  monthly: CurrentWeatherValue;
  yearly: CurrentWeatherValue;
};

type CurrentPressure = {
  relative: CurrentWeatherValue;
  absolute: CurrentWeatherValue;
};

type CurrentSolarAndUvi = {
  solar: CurrentWeatherValue;
  uvi: CurrentWeatherValue;
};

export type CurrentWeatherValue = {
  time: string;
  unit: string;
  value: string;
};

export type HistoryWeatherValue = {
  unit: string;
  list: Record<string, string>;
};

export type ForecastWeather = {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  description: string;
  days: ForecastDay[];
  alerts: ForecastAlert[];
  currentConditions: ForecastCurrentConditions;
};

type ForecastDay = {
  datetime: string;
  datetimeEpoch: number;
  tempmax: number;
  tempmin: number;
  temp: number;
  feelslikemax: number;
  feelslikemin: number;
  feelslike: number;
  dew: number;
  humidity: number;
  precip: number;
  precipprob: number;
  precipcover: number;
  preciptype: PrecipType[] | null;
  snow: number;
  snowdepth: number;
  windgust: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  cloudcover: number;
  visibility: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  severerisk: number;
  sunrise: string;
  sunriseEpoch: number;
  sunset: string;
  sunsetEpoch: number;
  moonphase: number;
  conditions: string;
  description: string;
  icon: string;
  hours: ForecastHour[];
};

type PrecipType = "rain" | "snow" | "freezingrain" | "ice";

type ForecastAlert = {
  event: string;
  headline: string;
  description: string;
  onset: string;
  ends: string;
};

type ForecastCurrentConditions = {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  dew: number;
  precip: number;
  precipprob: number;
  snow: number;
  snowdepth: number;
  windgust: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  conditions: string;
  icon: ForecastIcon;
  sunrise: string;
  sunriseEpoch: number;
  sunset: string;
  sunsetEpoch: number;
  moonphase: number;
};

type ForecastIcon =
  | "snow"
  | "rain"
  | "fog"
  | "wind"
  | "cloudy"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "clear-day"
  | "clear-night";

type ForecastHour = {
  datetime: string;
  datetimeEpoch: number;
  temp: null | number;
  feelslike: null | number;
  humidity: null | number;
  dew: null | number;
  precip: null | number;
  precipprob: null | number;
  snow: null | number;
  snowdepth: null | number;
  preciptype: PrecipType[] | null;
  windgust: null | number;
  windspeed: null | number;
  winddir: null | number;
  pressure: null | number;
  visibility: null | number;
  cloudcover: null | number;
  solarradiation: null | number;
  solarenergy: null | number;
  uvindex: null | number;
  conditions: string; // Can be an empty string when date is in the past
  icon: string; // Can be an empty string when date is in the past
  stations: null;
};

// Moonphase
// A decimal value representing the current moon phase between 0 and 1 where 0 represents the new moon, 0.5 represents the full moon. The full cycle can be represented as:

// 0 – new moon
// 0-0.25 – waxing crescent
// 0.25 – first quarter
// 0.25-0.5 – waxing gibbous
// 0.5 – full moon
// 0.5-0.75 – waning gibbous
// 0.75 – last quarter
// 0.75 -1 – waning crescent
