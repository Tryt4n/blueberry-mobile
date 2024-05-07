import { createContext, useState } from "react";
import { getCurrentPrice } from "@/api/appwrite/currentPrice";
import { useAppwrite } from "@/hooks/useAppwrite";
import type { Order } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrdersDataType = {
  data: Order[] | undefined;
  isLoading: boolean;
  refetchData: () => Promise<void>;
};

type OrderContextType = {
  currentPrice: CurrentPrice["price"] | undefined;
  currentPriceId: CurrentPrice["$id"] | undefined;
  ordersData: OrdersDataType | null;
  setOrdersData: React.Dispatch<React.SetStateAction<OrdersDataType | null>>;
  editedOrder: Order | null;
  setEditedOrder: (order: Order | null) => void;
};

export const OrdersContext = createContext<OrderContextType | null>(null);

export default function OrderContextProvider({ children }: { children: React.ReactNode }) {
  const [ordersData, setOrdersData] = useState<OrderContextType["ordersData"]>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  const { data: currentPriceObj } = useAppwrite(getCurrentPrice, [], {
    title: "Błąd",
    message: "Nie udało się pobrać aktualnej ceny.",
  });

  const contextValues: OrderContextType = {
    currentPrice: currentPriceObj?.price,
    currentPriceId: currentPriceObj?.$id,
    ordersData,
    setOrdersData,
    editedOrder,
    setEditedOrder,
  };

  return <OrdersContext.Provider value={contextValues}>{children}</OrdersContext.Provider>;
}
