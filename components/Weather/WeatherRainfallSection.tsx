import { Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import WeatherSection from "./WeatherSection";
import type { CurrentWeather } from "@/types/weather";

type WeatherRainfallSectionProps = {
  currentRainfall: CurrentWeather["rainfall"];
};

export default function WeatherRainfallSection({ currentRainfall }: WeatherRainfallSectionProps) {
  return (
    <WeatherSection heading="Opady">
      <RainFallText
        text="Aktualny opad"
        value={currentRainfall.rain_rate.value}
        unit={currentRainfall.rain_rate.unit}
        largerValueText={"3xl"}
      />

      {currentRainfall.rain_rate.value !== "0.0" && (
        <RainFallText
          text="Od rozpoczęcia opadu"
          value={currentRainfall.event.value}
          unit={currentRainfall.event.unit}
          largerValueText={"xl"}
        />
      )}

      <RainFallText
        text="W ciągu dnia"
        value={currentRainfall.daily.value}
        unit={currentRainfall.daily.unit}
      />

      <RainFallText
        text="Godzinowo"
        value={currentRainfall.hourly.value}
        unit={currentRainfall.hourly.unit}
      />

      <RainFallText
        text="Tygodniowo"
        value={currentRainfall.weekly.value}
        unit={currentRainfall.weekly.unit}
      />

      <RainFallText
        text="Miesięcznie"
        value={currentRainfall.monthly.value}
        unit={currentRainfall.monthly.unit}
      />

      <RainFallText
        text="Rocznie"
        value={currentRainfall.yearly.value}
        unit={currentRainfall.yearly.unit}
      />
    </WeatherSection>
  );
}

function RainFallText({
  text,
  value,
  unit,
  largerValueText = false,
}: {
  text: string;
  value: string;
  unit: string;
  largerValueText?: "xl" | "2xl" | "3xl" | false;
}) {
  const { colors } = useThemeContext();

  return (
    <Text style={tw`mt-4 font-poppinsRegular text-[${colors.textAccent}]`}>
      {text}:{" "}
      <Text
        style={tw`text-[${colors.text}] ${
          largerValueText ? `text-${largerValueText}` : "text-base"
        }`}
      >
        {value}
      </Text>{" "}
      {unit}
    </Text>
  );
}
