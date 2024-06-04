import { createContext, useCallback, useState } from "react";
import { deleteOrder as deleteOrderAppwrite } from "@/api/appwrite/orders";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { format } from "date-fns";
import { pl } from "date-fns/locale/pl";
import Toast from "react-native-toast-message";
import type { Order, OrdersDataType, OrdersSearchParams } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrderContextType = {
  currentPrice: CurrentPrice | null;
  setCurrentPrice: (obj: CurrentPrice) => void;
  ordersData: OrdersDataType | null;
  setOrdersData: (obj: OrdersDataType | null) => void;
  editedOrder: Order | null;
  setEditedOrder: (order: Order | null) => void;
  deleteOrder: (orderId: Order["$id"]) => Promise<void>;
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
  const { showAlert } = useGlobalContext();
  const { theme } = useThemeContext();

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

  const deleteOrder = useCallback(
    async (orderId: Order["$id"]) => {
      try {
        await deleteOrderAppwrite(orderId);

        setOrdersData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            data: prevData?.data?.filter((order) => order.$id !== orderId),
          };
        });

        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: "Zamówienie zostało pomyślnie",
          text2: "usunięte.",
          text2Style: { fontWeight: "bold" },
        });
      } catch (error) {
        showAlert("Błąd", "Nie udało się usunąć zamówienia.");
      }
    },
    [deleteOrderAppwrite]
  );

  const contextValues: OrderContextType = {
    currentPrice,
    setCurrentPrice,
    ordersData,
    setOrdersData,
    editedOrder,
    setEditedOrder,
    deleteOrder,
    isBannerVisible,
    setIsBannerVisible,
    ordersSearchParams,
    setOrdersSearchParams,
    today: formattedTodayDate,
  };

  return <OrdersContext.Provider value={contextValues}>{children}</OrdersContext.Provider>;
}
