import { OrdersContext } from "@/context/OrdersContext";
import { useContext } from "react";

export function useOrdersContext() {
  const ordersContext = useContext(OrdersContext);

  if (!ordersContext) {
    throw new Error("useOrdersContext must be used within a OrdersContextProvider");
  }

  return ordersContext;
}
