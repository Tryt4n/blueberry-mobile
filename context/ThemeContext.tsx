import { useColorScheme } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { editUserTheme } from "@/api/appwrite/users";
import { colors as customColors } from "@/constants/colors";
import { createContext, useEffect, useState } from "react";
import type { Theme } from "@/types/theme";

export type Colors =
  | "primary"
  | "danger"
  | "placeholder"
  | "bg"
  | "bgAccent"
  | "text"
  | "textAccent"
  | "menuIcon"
  | "tabIcon"
  | "border"
  | "inputBorder"
  | "green";

type ThemeContextValues = {
  theme: Theme;
  changeUserTheme: (theme: Theme) => Promise<void>;
  colors: Record<Colors, string>;
};

export const ThemeContext = createContext<ThemeContextValues | null>(null);

export default function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const { user } = useGlobalContext();

  const [theme, setTheme] = useState<Theme>(user?.theme ? user.theme : scheme!);

  async function changeUserTheme(theme: Theme) {
    if (!user) return;

    setTheme(theme);
    await editUserTheme(user.$id, theme); // Update user's theme in the database
  }

  useEffect(() => {
    // If user has a theme set, use it instead of the device's theme
    if (user && user.theme) {
      setTheme(user.theme);
    }
  }, [user]);

  const colors = {
    primary: theme === "light" ? customColors.primaryLight : customColors.primaryDark,
    danger: theme === "light" ? customColors.dangerLight : customColors.dangerDark,
    placeholder: theme === "light" ? customColors.placeholderLight : customColors.placeholderDark,
    inputBorder: theme === "light" ? customColors.inputBorderLight : customColors.inputBorderDark,
    bg: theme === "light" ? customColors.bgLight : customColors.bgDark,
    bgAccent: theme === "light" ? customColors.bgAccentLight : customColors.bgAccentDark,
    text: theme === "light" ? customColors.textLight : customColors.textDark,
    textAccent: theme === "light" ? customColors.textAccentLight : customColors.textAccentDark,
    menuIcon: theme === "light" ? customColors.menuIconLight : customColors.menuIconDark,
    tabIcon: theme === "light" ? customColors.tabIconLight : customColors.tabIconDark,
    border: theme === "light" ? customColors.borderLight : customColors.borderDark,
    green: theme === "light" ? customColors.greenLight : customColors.greenDark,
  };

  const contextValues: ThemeContextValues = {
    theme,
    changeUserTheme,
    colors,
  };

  return <ThemeContext.Provider value={contextValues}>{children}</ThemeContext.Provider>;
}
