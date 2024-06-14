import { View } from "react-native";
import tw from "@/lib/twrnc";
import WeatherSection from "./WeatherSection";
import WeatherPressureSubSection from "./WeatherPressureSubSection";
import type { CurrentWeather, HistoryWeather } from "@/types/weather";

type WeatherPressureSectionProps = {
  currentPressure: CurrentWeather["pressure"];
  historyPressure: HistoryWeather["pressure"];
};

export default function WeatherPressureSection({
  currentPressure,
  historyPressure,
}: WeatherPressureSectionProps) {
  return (
    <WeatherSection heading="Ciśnienie">
      <View style={tw`justify-center items-center gap-y-8`}>
        <WeatherPressureSubSection
          heading="Względne"
          pressure={currentPressure.relative}
          historyList={historyPressure.relative.list}
          unit={currentPressure.relative.unit}
        />

        <WeatherPressureSubSection
          heading="Bezwzględne"
          pressure={currentPressure.absolute}
          historyList={historyPressure.absolute.list}
          unit={currentPressure.absolute.unit}
        />
      </View>
    </WeatherSection>
  );
}
