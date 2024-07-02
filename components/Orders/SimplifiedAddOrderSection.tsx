import { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import SimplifiedOrderCard from "./SimplifiedOrderCard";
import { isPast, isToday, parseISO } from "date-fns";

export default function SimplifiedAddOrderSection() {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();
  const { currentPrice, ordersSearchParams, today } = useOrdersContext();
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const useHasAccess = user?.role === "admin" || user?.role === "moderator";

  useEffect(() => {
    const startDate = parseISO(ordersSearchParams.startDate);
    const todayDate = parseISO(today);

    let dateToCompare;

    if (ordersSearchParams.startDate === ordersSearchParams.endDate) {
      dateToCompare = startDate;
    } else {
      dateToCompare = todayDate;
    }

    // Check if dateToCompare is today's date
    if (isToday(dateToCompare)) {
      setShouldDisplay(true);
    } else {
      setShouldDisplay(!isPast(dateToCompare));
    }
  }, [ordersSearchParams, today]);

  return (
    <>
      {
        // Display only if user has access or when the date is today or in the future
        (useHasAccess || shouldDisplay) && (
          <SimplifiedOrderCard
            type="new"
            price={currentPrice?.price || null}
            containerStyles={`bg-[${colors.bg}]`}
          />
        )
      }
    </>
  );
}
