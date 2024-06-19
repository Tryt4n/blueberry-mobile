import WeatherContextProvider from "@/context/WeatherContext";

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return <WeatherContextProvider>{children}</WeatherContextProvider>;
}
