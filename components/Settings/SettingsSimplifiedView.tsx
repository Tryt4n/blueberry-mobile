import { View, Text, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { editUserViewPreferences } from "@/api/appwrite/users";
import tw from "@/lib/twrnc";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function SettingsSimplifiedView() {
  const { user, isSimplifiedView, setIsSimplifiedView, refetchUser, showAlert } =
    useGlobalContext();
  const { theme, colors } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);

  async function changeUserViewPreferences() {
    if (!user) return;

    setIsLoading(true);

    try {
      await editUserViewPreferences(user.$id, !isSimplifiedView).then(() => {
        setIsSimplifiedView(!isSimplifiedView);
        refetchUser();
        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: "Pomyślnie zmieniono",
          text2: "preferencje wyświetlania.",
          topOffset: 50,
        });
      });
    } catch (error) {
      showAlert("Błąd", "Wystąpił błąd podczas zmiany preferencji widoku. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={tw`h-9 flex-row gap-x-2 items-center justify-center`}>
      <Text style={tw`font-poppinsSemiBold text-[${colors.text}]`}>Widok uproszczony</Text>

      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primary}
          style={tw`h-9 w-9`}
        />
      ) : (
        <Checkbox
          status={
            isSimplifiedView === true
              ? "checked"
              : isSimplifiedView === false
              ? "unchecked"
              : "indeterminate"
          }
          color={colors.primary}
          uncheckedColor={colors.placeholder}
          disabled={isSimplifiedView === undefined || isLoading}
          onPress={changeUserViewPreferences}
        />
      )}
    </View>
  );
}
