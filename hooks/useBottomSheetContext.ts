import { BottomSheetTabsContext } from "@/context/BottomSheetTabsContext";
import { useContext } from "react";

export function useBottomSheetContext() {
  const bottomSheetTabsContext = useContext(BottomSheetTabsContext);

  if (!bottomSheetTabsContext) {
    throw new Error("useBottomSheetContext must be used within a BottomSheetTabsContextProvider");
  }

  return bottomSheetTabsContext;
}
