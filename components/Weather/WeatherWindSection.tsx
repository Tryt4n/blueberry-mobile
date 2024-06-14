import { View } from "react-native";
import tw from "@/lib/twrnc";
import WeatherSection from "./WeatherSection";
import WeatherWindSubSection from "./WeatherWindSubSection";
import WeatherWindCompass from "./WeatherWindCompass";
import type { CurrentWeather, HistoryWeather } from "@/types/weather";

type WeatherWindSectionProps = {
  currentWind: CurrentWeather["wind"];
  historyWind: HistoryWeather["wind"];
};

export default function WeatherWindSection({ currentWind, historyWind }: WeatherWindSectionProps) {
  return (
    <WeatherSection heading="Wiatr">
      <View style={tw`justify-center items-center`}>
        <WeatherWindSubSection
          heading="Prędkość wiatru"
          windSpeed={currentWind.wind_speed}
          historyWindList={historyWind.wind_speed.list}
          unit={currentWind.wind_speed.unit}
        />

        <WeatherWindCompass currentWind={currentWind} />

        <WeatherWindSubSection
          heading="Porywy wiatru"
          windSpeed={currentWind.wind_gust}
          historyWindList={historyWind.wind_gust.list}
          unit={currentWind.wind_gust.unit}
        />
      </View>
    </WeatherSection>
  );
}
