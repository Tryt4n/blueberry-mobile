import { Calendar, LocaleConfig } from "react-native-calendars";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeContext } from "@/hooks/useThemeContext";
import { colors as customColors } from "@/constants/colors";
import type { ComponentProps } from "react";

export default function ModalCalendar({ ...props }: ComponentProps<typeof Calendar>) {
  LocaleConfig.locales["pl"] = {
    monthNames: [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ],
    monthNamesShort: [
      "Sty",
      "Lut",
      "Mar",
      "Kwi",
      "Maj",
      "Cze",
      "Lip",
      "Sie",
      "Wrz",
      "Paź",
      "Lis",
      "Gru",
    ],
    dayNames: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
    dayNamesShort: ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sob"],
    today: "Dzisiaj",
  };
  LocaleConfig.defaultLocale = "pl";

  const { theme, colors } = useThemeContext();

  return (
    <Calendar
      {...props}
      firstDay={1}
      monthFormat="MMMM yyyy"
      enableSwipeMonths={true}
      renderArrow={(direction) => <Arrow direction={direction} />}
      theme={{
        calendarBackground: colors.bg,
        textSectionTitleColor: theme === "dark" ? "#C1BCB4" : "#b6c1cd",
        todayTextColor: theme === "dark" ? customColors.primaryLight : colors.primary,
        dayTextColor: theme === "dark" ? "#C5D2DC" : "#2D4150",
        textDisabledColor: theme === "dark" ? "#2D4150" : "#D9E1E8",
        monthTextColor: theme === "dark" ? "#AEC3D2" : "#2D4150",
        indicatorColor: "blue",
        textDayFontFamily: "Poppins-Regular",
        textMonthFontFamily: "Poppins-Regular",
        textDayHeaderFontFamily: "Poppins-SemiBold",
      }}
    />
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  const { colors } = useThemeContext();

  return (
    <FontAwesome
      name={direction === "left" ? "caret-left" : "caret-right"}
      size={16}
      color={colors.primary}
    />
  );
}
