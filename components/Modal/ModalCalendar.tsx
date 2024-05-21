import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/helpers/colors";
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

  return (
    <Calendar
      {...props}
      firstDay={1}
      monthFormat="MMMM yyyy"
      enableSwipeMonths={true}
      renderArrow={(direction) => <Arrow direction={direction} />}
    />
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <FontAwesome
      name={direction === "left" ? "caret-left" : "caret-right"}
      size={16}
      color={colors.primary}
    />
  );
}
