import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native";
import { useState } from "react";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import OrderCard from "./OrderCard";
import Toast from "react-native-toast-message";

export default function OrdersList() {
  const { user } = useGlobalContext();
  const { currentPrice, ordersData, setIsBannerVisible } = useOrdersContext();
  const [refreshing, setRefreshing] = useState(false);

  async function refetchOrders() {
    setRefreshing(true);
    setIsBannerVisible(false);

    ordersData && (await ordersData.refetchData());

    Toast.show({
      type: "info",
      text1: "Zaktualizowano zamówienia",
      text1Style: { textAlign: "center", fontSize: 16 },
    });

    setRefreshing(false);
  }

  return (
    <>
      {user && ordersData && ordersData.data && ordersData.data.length > 0 && currentPrice && (
        <FlashList
          data={ordersData.data}
          keyExtractor={(order) => order.$id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: user.role === "admin" || user.role === "moderator" ? 16 : 0,
          }}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              price={currentPrice.price}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refetchOrders}
            />
          }
          estimatedItemSize={10}
        />
      )}
    </>
  );
}
