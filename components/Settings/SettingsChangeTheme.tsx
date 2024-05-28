import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import tw from "@/lib/twrnc";
import { colors } from "@/helpers/colors";
import { Switch } from "react-native-paper";

export default function SettingsChangeTheme() {
  const { platform } = useGlobalContext();

  const [isDarkMode, setIsDarkMode] = useState(false); // Create theme context and move this state to it

  return (
    <View>
      <Text style={tw`font-poppinsSemiBold`}>Tryb</Text>
      <View style={tw`flex-row justify-center items-center gap-2`}>
        <TouchableOpacity
          onPress={() => setIsDarkMode(false)}
          disabled={!isDarkMode}
        >
          <Text style={tw`font-poppinsMedium ${!isDarkMode ? "text-primary" : ""}`}>Jasny</Text>
        </TouchableOpacity>

        <Switch
          color={colors.primary}
          thumbColor={colors.primary}
          trackColor={{ false: "rgba(59, 130, 246, 0.5)", true: "rgba(59, 130, 246, 0.5)" }}
          value={isDarkMode}
          onValueChange={() => setIsDarkMode(!isDarkMode)}
          style={platform === "web" ? tw`h-10 w-20` : undefined}
        />

        <TouchableOpacity
          onPress={() => setIsDarkMode(true)}
          disabled={isDarkMode}
        >
          <Text style={tw`font-poppinsMedium ${isDarkMode ? "text-primary" : ""}`}>Ciemny</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
