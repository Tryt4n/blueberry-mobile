import { View } from "react-native";
import tw from "@/lib/twrnc";
import WeatherAstronomicPanelSection from "./WeatherAstronomicPanelSection";

type AstronomicValues = {
  sunrise: string;
  sunset: string;
};

export default function WeatherAstronomicPanel({
  astronomicValues,
}: {
  astronomicValues: AstronomicValues;
}) {
  return (
    <View style={tw`mt-4 items-center gap-y-2`}>
      <WeatherAstronomicPanelSection
        heading="Wschód słońca"
        value={astronomicValues.sunrise}
      />

      <WeatherAstronomicPanelSection
        heading="Zachód słońca"
        value={astronomicValues.sunset}
      />
    </View>
  );
}
