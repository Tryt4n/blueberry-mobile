import { View, Text } from "react-native";
import React from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { Entypo } from "@expo/vector-icons";
import type { CurrentWeather } from "@/types/weather";

type WeatherWindCompassProps = {
  currentWind: CurrentWeather["wind"];
};

export default function WeatherWindCompass({ currentWind }: WeatherWindCompassProps) {
  const { colors } = useThemeContext();

  const radius = (48 * 4) / 2; // half of width of the compass, (48 * 4) is tailwindcss value in px
  const angleInRadians = (Number(currentWind.wind_direction.value) - 90) * (Math.PI / 180); // convert degrees to radians and subtract 90 degrees so that the arrow points correctly
  const x = radius + radius * Math.cos(angleInRadians); // calculate x position
  const y = radius + radius * Math.sin(angleInRadians); // calculate y position

  return (
    <View
      style={tw`my-10 relative w-48 h-48 bg-transparent border border-[${colors.text}] rounded-full justify-center items-center`}
    >
      {[...Array(4)].map((_, i) => {
        const rotation = i * 90;
        const transformY = -87.75;

        return (
          <React.Fragment key={i}>
            <View
              style={{
                ...tw`absolute w-0.5 h-4 bg-[${colors.text}]`,
                transform: `rotate(${rotation}deg) translateY(${transformY}px)`,
              }}
            />
            <Text
              style={{
                ...tw`absolute font-poppinsLight text-[${colors.textAccent}]`,
                transform: `rotate(${rotation}deg) translateY(${transformY - 20}px)`,
              }}
            >
              {rotation}
              {currentWind.wind_direction.unit}
            </Text>
          </React.Fragment>
        );
      })}
      {[...Array(8)].map((_, i) => (
        <View
          key={i}
          style={{
            ...tw`absolute w-0.5 h-2 bg-[${colors.text}]`,
            transform: `rotate(${i * 45}deg) translateY(-91.5px)`,
          }}
        />
      ))}
      {[...Array(72)].map((_, i) => (
        <View
          key={i}
          style={{
            ...tw`absolute w-[1px] h-1 bg-[${colors.text}]`,
            transform: `rotate(${i * 5}deg) translateY(-92px)`,
          }}
        />
      ))}

      <Entypo
        name="arrow-long-down"
        size={32}
        color={colors.text}
        style={{
          position: "absolute",
          left: x - 16, // subtract half of the arrow height to center it
          top: y - 16, // subtract half of the arrow height to center it
          transform: [
            { rotate: `${currentWind.wind_direction.value}deg` }, // rotate the arrow based on the wind direction
            { translateY: -20 }, // add some offset to center the arrow
          ],
        }}
      />

      <View style={tw`justify-center items-center`}>
        <Text style={tw`font-poppinsMedium text-3xl text-[${colors.text}]`}>
          {currentWind.wind_direction.value}
          {currentWind.wind_direction.unit}
        </Text>

        <Text style={tw`font-poppinsRegular text-lg text-[${colors.textAccent}]`}>Direction</Text>
      </View>
    </View>
  );
}
