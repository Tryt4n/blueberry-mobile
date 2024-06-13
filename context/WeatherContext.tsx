import { createContext } from "react";

type WeatherContextType = {
  today: Date;
};

export const WeatherContext = createContext<WeatherContextType | null>(null);

export default function WeatherContextProvider({ children }: { children: React.ReactNode }) {
  const today = new Date();

  const contextValues: WeatherContextType = { today };

  return <WeatherContext.Provider value={contextValues}>{children}</WeatherContext.Provider>;
}
