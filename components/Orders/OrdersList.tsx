import { FlashList } from "@shopify/flash-list";
import { RefreshControl, useWindowDimensions } from "react-native";
import { useState } from "react";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import OrderCard from "./OrderCard";
import Toast from "react-native-toast-message";

export default function OrdersList() {
  const { user, platform } = useGlobalContext();
  const { currentPrice, ordersData, setIsBannerVisible } = useOrdersContext();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

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
          horizontal={platform === "web" && width > 700 ? false : undefined}
          numColumns={platform === "web" ? (width >= 1400 ? 3 : width >= 700 ? 2 : 1) : undefined}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              price={currentPrice.price}
              additionalStyles={platform === "web" && width > 700 ? "max-w-[95%] mr-4" : ""}
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
