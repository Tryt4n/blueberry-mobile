import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { colors as customColors } from "@/helpers/colors";
import tw from "@/lib/twrnc";
import { Switch } from "react-native-paper";

export default function SettingsChangeTheme() {
  const { platform } = useGlobalContext();
  const { colors, theme, changeUserTheme } = useThemeContext();

  return (
    <View>
      <Text style={tw`font-poppinsSemiBold text-[${colors.text}]`}>Motyw</Text>
      <View style={tw`flex-row justify-center items-center gap-2`}>
        <TouchableOpacity
          onPress={() => changeUserTheme("light")}
          disabled={theme === "light"}
        >
          <Text
            style={tw`font-poppinsMedium text-[${colors.text}] ${
              theme === "light" ? `text-[${colors.primary}]` : ""
            }`}
          >
            Jasny
          </Text>
        </TouchableOpacity>

        <Switch
          style={platform === "web" ? tw`h-10 w-20` : undefined}
          color={colors.primary}
          thumbColor={colors.primary}
          trackColor={{ false: "rgba(59, 130, 246, 0.5)", true: "rgba(59, 130, 246, 0.5)" }}
          onValueChange={() => changeUserTheme(theme === "light" ? "dark" : "light")}
          value={theme === "dark"}
        />

        <TouchableOpacity
          onPress={() => changeUserTheme("dark")}
          disabled={theme === "dark"}
        >
          <Text
            style={tw`font-poppinsMedium text-[${colors.text}] ${
              theme === "dark" ? `text-[${customColors.primaryLight}]` : ""
            }`}
          >
            Ciemny
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
