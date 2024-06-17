import WeatherForecastDaily from "./WeatherForecastDaily";
import WeatherForecastHourly from "./WeatherForecastHourly";
import Divider from "@/components/Divider";
import type { ForecastWeather } from "@/types/weather";

type WeatherForecastProps = {
  forecast: ForecastWeather["days"];
  tempUnit: string;
  windUnit: string;
};

export default function WeatherForecast({ forecast, tempUnit, windUnit }: WeatherForecastProps) {
  return (
    <>
      <WeatherForecastDaily
        forecast={forecast}
        tempUnit={tempUnit}
        windUnit={windUnit}
      />

      <Divider />

      <WeatherForecastHourly
        forecast={forecast}
        tempUnit={tempUnit}
        windUnit={windUnit}
      />
    </>
  );
}
