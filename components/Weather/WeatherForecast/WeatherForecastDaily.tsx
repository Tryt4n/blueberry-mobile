import { formatDate } from "@/helpers/dates";
import { isToday } from "date-fns/isToday";
import { FlashList } from "@shopify/flash-list";
import WeatherForecastLayout from "./WeatherForecastLayout";
import WeatherForecastListItem from "./WeatherForecastListItem";
import type { WeatherShortenedForecast } from "./WeatherForecast";

export default function WeatherForecastDaily({ forecast }: { forecast: WeatherShortenedForecast }) {
  return (
    <WeatherForecastLayout heading="Prognoza dzienna">
      <FlashList
        horizontal
        data={forecast}
        keyExtractor={(item) => item.datetimeEpoch.toString()}
        estimatedItemSize={forecast.length}
        renderItem={({ item: day, index }) => (
          <WeatherForecastListItem
            data={day}
            index={index}
            currentText={isToday(day.datetime) ? "Dzisiaj" : formatDate(day.datetime, "EE dd")}
          />
        )}
      />
    </WeatherForecastLayout>
  );
}
