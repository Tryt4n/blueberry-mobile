import WeatherSection from "./WeatherSection";
import WeatherSolarSubSection from "./WeatherSolarSubSection";
import WeatherAstronomicPanel from "./WeatherAstronomicPanel";
import type { CurrentWeather, HistoryWeather } from "@/types/weather";

type WeatherSolarSectionProps = {
  currentSolar: CurrentWeather["solar_and_uvi"];
  historySolar: HistoryWeather["solar_and_uvi"];
  astronomicValues: AstronomicValues;
};

type AstronomicValues = {
  sunrise: string;
  sunset: string;
};

export default function WeatherSolarSection({
  currentSolar,
  historySolar,
  astronomicValues,
}: WeatherSolarSectionProps) {
  return (
    <WeatherSection heading="Słońce">
      <WeatherSolarSubSection
        heading="Index UV"
        currentValue={currentSolar.uvi}
        historyList={historySolar.uvi.list}
      />

      <WeatherSolarSubSection
        heading="Nasłonecznienie"
        currentValue={currentSolar.solar}
        historyList={historySolar.solar.list}
      />

      {astronomicValues && <WeatherAstronomicPanel astronomicValues={astronomicValues} />}
    </WeatherSection>
  );
}
