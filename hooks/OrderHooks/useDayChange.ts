import { useCallback } from "react";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { format } from "date-fns";
import { pl } from "date-fns/locale/pl";

export function useDayChange() {
  const { ordersData, ordersSearchParams, setOrdersSearchParams } = useOrdersContext();

  const handleDayChange = useCallback(
    (direction: "prev" | "next") => {
      const dayToChange = new Date(
        direction === "prev" ? ordersSearchParams.startDate : ordersSearchParams.endDate
      );

      const changedDay = format(
        dayToChange.setDate(dayToChange.getDate() + (direction === "prev" ? -1 : 1)),
        "yyyy-MM-dd",
        { locale: pl }
      );

      setOrdersSearchParams((prevState) => ({
        ...prevState,
        startDate: changedDay,
        endDate: changedDay,
      }));
    },
    [ordersSearchParams, ordersData]
  );

  return handleDayChange;
}
