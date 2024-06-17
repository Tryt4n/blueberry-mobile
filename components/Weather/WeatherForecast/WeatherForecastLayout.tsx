import { ScrollView } from "react-native";
import tw from "@/lib/twrnc";
import WeatherSection from "../WeatherSection";

type WeatherForecastLayoutProps = {
  heading: string;
  children: React.ReactNode;
};

export default function WeatherForecastLayout({ heading, children }: WeatherForecastLayoutProps) {
  return (
    <WeatherSection
      heading={heading}
      containerStyles="mb-4"
    >
      <ScrollView
        horizontal
        style={tw`w-full flex-row mt-4 py-4`}
      >
        {children}
      </ScrollView>
    </WeatherSection>
  );
}
