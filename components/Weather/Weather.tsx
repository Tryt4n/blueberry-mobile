import { Text, ScrollView, Dimensions } from "react-native";
import { useRef, useState } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useWeatherContext } from "@/hooks/useWeatherContext";
import tw from "@/lib/twrnc";
import PageLayout from "@/layout/PageLayout";
import LoadingSpinner from "../LoadingSpinner";
import WeatherData from "./WeatherData";
import ScrollToTop from "../ScrollToTop";

export default function Weather() {
  const { colors } = useThemeContext();
  const { currentWeather, currentWeatherData, weatherHistory, elapsedTimeFromLastUpdate } =
    useWeatherContext();

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const isLoading =
    (currentWeather.isLoading || weatherHistory.isLoading) &&
    !currentWeatherData &&
    !weatherHistory.data;

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onScroll={(event) => {
          const hasScrolledHalfScreenLength =
            event.nativeEvent.contentOffset.y >= Dimensions.get("window").height / 2;
          setIsScrolled(hasScrolledHalfScreenLength);
        }}
        scrollEventThrottle={16} // (1000ms / 60fps = 16ms)
      >
        <PageLayout containerStyles="my-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Text style={tw`font-poppinsBold text-3xl text-[${colors.text}]`}>Pogoda</Text>

              <Text style={tw`mt-2 font-poppinsLight text-xs text-[${colors.textAccent}]`}>
                Zaktualizowano {elapsedTimeFromLastUpdate} sekund
                {elapsedTimeFromLastUpdate === 1
                  ? "ę"
                  : elapsedTimeFromLastUpdate >= 2 && elapsedTimeFromLastUpdate <= 4
                  ? "y"
                  : ""}
                &nbsp;temu
              </Text>

              <WeatherData />
            </>
          )}
        </PageLayout>
      </ScrollView>

      {!isLoading && isScrolled && (
        <ScrollToTop onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })} />
      )}
    </>
  );
}
