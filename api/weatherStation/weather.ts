import axios from "axios";
import { baseWeatherApiUrl, weatherConfig, callBackOptionsUrl } from "./weatherAPIConfig";

export async function getCurrentWeatherData() {
  try {
    const response = await axios.get(
      `${baseWeatherApiUrl}/real_time?application_key=${weatherConfig.appKey}&api_key=${weatherConfig.apiKey}&mac=${weatherConfig.weatherStationMacAddress}&${callBackOptionsUrl}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error("Nie udało się pobrać aktualnej pogody");
  }
}

export async function getWeatherDataHistoryByDate(startDate: string, endDate: string) {
  try {
    const response = await axios.get(
      `${baseWeatherApiUrl}/history?application_key=${weatherConfig.appKey}&api_key=${weatherConfig.apiKey}&mac=${weatherConfig.weatherStationMacAddress}&start_date=${startDate} 00:00:00&end_date=${endDate} 23:59:59&cycle_type=auto&${callBackOptionsUrl}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error("Nie udało się pobrać historii pogody");
  }
}

export async function getForecast() {
  try {
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Jaczew?unitGroup=us&include=fcst%2Cevents%2Cdays%2Ccurrent%2Chours%2Calerts&key=${weatherConfig.forecastApiKey}&contentType=json`
    );

    return response.data;
  } catch (error) {
    throw new Error("Nie udało się pobrać prognozy pogody");
  }
}