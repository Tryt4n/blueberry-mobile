import { createContext, useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useDataFetch } from "@/hooks/useDataFetch";
import { getOrders } from "@/api/appwrite/orders";
import { getBuyers } from "@/api/appwrite/buyers";
import { format } from "date-fns";
import { pl } from "date-fns/locale/pl";
import type { Order, OrdersDataType, OrdersSearchParams } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";
import type { Buyer } from "@/types/buyers";

type OrderContextType = {
  currentPrice: CurrentPrice | null;
  setCurrentPrice: (obj: CurrentPrice) => void;
  ordersData: OrdersDataType | null;
  editedOrder: Order | null;
  setEditedOrder: (order: Order | null) => void;
  isBannerVisible: boolean;
  setIsBannerVisible: (value: boolean) => void;
  fetchedBuyers: ReturnType<typeof useDataFetch> & { data?: Buyer[] };
  ordersSearchParams: OrdersSearchParams;
  setOrdersSearchParams: (
    value: ((prevState: OrdersSearchParams) => OrdersSearchParams) | OrdersSearchParams
  ) => void;
  today: string;
};
export const OrdersContext = createContext<OrderContextType | null>(null);

export default function OrderContextProvider({ children }: { children: React.ReactNode }) {
  const { user } = useGlobalContext();

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

  const errorMessage = {
    title: "Błąd",
    message: "Nie udało się pobrać zamówień. Spróbuj odświeżyć stronę.",
  };

  const appwriteOrdersData = useDataFetch(
    getOrders,
    [
      ordersSearchParams.startDate,
      ordersSearchParams.endDate,
      user && user.role !== "admin" && user.role !== "moderator"
        ? user.$id
        : ordersSearchParams.userId
        ? ordersSearchParams.userId
        : undefined,
    ],
    errorMessage
  );

  // Refetch orders data when search params change
  useEffect(() => {
    appwriteOrdersData.refetchData();
  }, [ordersSearchParams]);

  // Set orders data to the context state if the data is loaded successfully
  useEffect(() => {
    setOrdersData(appwriteOrdersData);
  }, [appwriteOrdersData.isLoading, ordersSearchParams]);

  // Fetch all buyers
  const fetchedBuyers = useDataFetch(
    getBuyers,
    user?.role === "admin" || user?.role === "moderator" ? [] : [user?.$id],
    {
      title: "Błąd",
      message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
    }
  );

  const contextValues: OrderContextType = {
    currentPrice,
    setCurrentPrice,
    ordersData,
    editedOrder,
    setEditedOrder,
    isBannerVisible,
    setIsBannerVisible,
    fetchedBuyers,
    ordersSearchParams,
    setOrdersSearchParams,
    today: formattedTodayDate,
  };

  return <OrdersContext.Provider value={contextValues}>{children}</OrdersContext.Provider>;
}
