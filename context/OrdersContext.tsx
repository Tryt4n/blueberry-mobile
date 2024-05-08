import { createContext, useCallback, useState } from "react";
import { Alert } from "react-native";
import { getCurrentPrice } from "@/api/appwrite/currentPrice";
import { deleteOrder as deleteOrderAppwrite } from "@/api/appwrite/orders";
import { useAppwrite } from "@/hooks/useAppwrite";
import Toast from "react-native-toast-message";
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
  deleteOrder: (orderId: Order["$id"]) => Promise<void>;
};

export const OrdersContext = createContext<OrderContextType | null>(null);

export default function OrderContextProvider({ children }: { children: React.ReactNode }) {
  const [ordersData, setOrdersData] = useState<OrderContextType["ordersData"]>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  const { data: currentPriceObj } = useAppwrite(getCurrentPrice, [], {
    title: "Błąd",
    message: "Nie udało się pobrać aktualnej ceny.",
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
    currentPrice: currentPriceObj?.price,
    currentPriceId: currentPriceObj?.$id,
    ordersData,
    setOrdersData,
    editedOrder,
    setEditedOrder,
    deleteOrder,
  };

  return <OrdersContext.Provider value={contextValues}>{children}</OrdersContext.Provider>;
}
