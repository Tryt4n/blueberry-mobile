import { createContext, useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale/pl";
import type { Order, OrdersDataType, OrdersSearchParams } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrderContextType = {
  currentPrice: CurrentPrice | null;
  setCurrentPrice: (obj: CurrentPrice) => void;
  ordersData: OrdersDataType | null;
  setOrdersData: (obj: OrdersDataType | null) => void;
  editedOrder: Order | null;
  setEditedOrder: (order: Order | null) => void;
  isBannerVisible: boolean;
  setIsBannerVisible: (value: boolean) => void;
  ordersSearchParams: OrdersSearchParams;
  setOrdersSearchParams: (
    value: ((prevState: OrdersSearchParams) => OrdersSearchParams) | OrdersSearchParams
  ) => void;
  today: string;
};

export const OrdersContext = createContext<OrderContextType | null>(null);

export default function OrderContextProvider({ children }: { children: React.ReactNode }) {
  const [ordersData, setOrdersData] = useState<OrderContextType["ordersData"]>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [currentPrice, setCurrentPrice] = useState<CurrentPrice | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const today = new Date();
  const formattedTodayDate = format(today, "yyyy-MM-dd", { locale: pl });
  const [ordersSearchParams, setOrdersSearchParams] = useState<OrdersSearchParams>({
    startDate: formattedTodayDate,
    endDate: formattedTodayDate,
    userId: undefined,
  });

  const contextValues: OrderContextType = {
    currentPrice,
    setCurrentPrice,
    ordersData,
    setOrdersData,
    editedOrder,
    setEditedOrder,
    isBannerVisible,
    setIsBannerVisible,
    ordersSearchParams,
    setOrdersSearchParams,
    today: formattedTodayDate,
  };

  return <OrdersContext.Provider value={contextValues}>{children}</OrdersContext.Provider>;
}
