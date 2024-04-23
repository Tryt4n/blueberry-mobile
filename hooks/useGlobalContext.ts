import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";

export function useGlobalContext() {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }

  return globalContext;
}
