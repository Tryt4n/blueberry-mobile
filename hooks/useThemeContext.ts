import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export function useThemeContext() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }

  return themeContext;
}
