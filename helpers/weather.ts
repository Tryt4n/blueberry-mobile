import type { ForecastWeather } from "@/types/weather";

export function findExtremeValue(valuesList: Record<string, string>, find: "min" | "max") {
  const extremeValue =
    find === "max"
      ? Math.max(...Object.values(valuesList).map(Number))
      : Math.min(...Object.values(valuesList).map(Number));

  const extremeValueTime = Object.entries(valuesList).find(
    ([key, value]) => Number(value) === extremeValue
  )?.[0];

  return { extremeValue, extremeValueTime };
}
function mapHours(hour: ForecastWeather["days"][number]["hours"][number]) {
  const {
    datetime,
    datetimeEpoch,
    temp,
    icon,
    conditions,
    windspeed,
    winddir,
    precip,
    preciptype,
    precipprob,
  } = hour;

  return {
    datetime,
    datetimeEpoch,
    temp,
    icon,
    conditions,
    windspeed,
    winddir,
    precip,
    preciptype,
    precipprob,
  };
}

export function mapDays(day: ForecastWeather["days"][number], index: number) {
  const {
    datetime,
    datetimeEpoch,
    tempmax,
    tempmin,
    icon,
    conditions,
    windspeed,
    winddir,
    precip,
    preciptype,
    precipprob,
    hours,
  } = day;

  return {
    datetime,
    datetimeEpoch,
    tempmax,
    tempmin,
    icon,
    conditions,
    windspeed,
    winddir,
    precip,
    preciptype,
    precipprob,
    hours: index < 3 ? hours.map(mapHours) : undefined,
  };
}
