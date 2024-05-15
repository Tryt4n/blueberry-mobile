import { createContext, useCallback, useState } from "react";
import { deleteOrder as deleteOrderAppwrite } from "@/api/appwrite/orders";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrdersDataType = {
  data: Order[] | undefined;
  isLoading: boolean;
  refetchData: () => Promise<void>;
};

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
  dateRange: { startDate: string | undefined; endDate: string | undefined };
  setDateRange: (value: { startDate: string | undefined; endDate: string | undefined }) => void;
};

export const OrdersContext = createContext<OrderContextType | null>(null);

export default function OrderContextProvider({ children }: { children: React.ReactNode }) {
  const [ordersData, setOrdersData] = useState<OrderContextType["ordersData"]>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [currentPrice, setCurrentPrice] = useState<CurrentPrice | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
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
          type: "success",
          text1: "Zamówienie zostało pomyślnie",
          text2: "usunięte.",
          text1Style: { textAlign: "left", fontSize: 16 },
          text2Style: {
            textAlign: "left",
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
          },
        });
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się usunąć zamówienia.");
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
    dateRange,
    setDateRange,
  };

  return <OrdersContext.Provider value={contextValues}>{children}</OrdersContext.Provider>;
}
