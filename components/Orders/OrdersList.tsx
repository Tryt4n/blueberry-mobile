import { FlashList } from "@shopify/flash-list";
import { RefreshControl, useWindowDimensions } from "react-native";
import { useCallback, useState, memo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import OrderCard from "./OrderCard";
import Toast from "react-native-toast-message";

function OrdersList() {
  const { user, platform } = useGlobalContext();
  const { theme, colors } = useThemeContext();
  const { currentPrice, ordersData, setIsBannerVisible } = useOrdersContext();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const refetchOrders = useCallback(async () => {
    setRefreshing(true);
    setIsBannerVisible(false);

    await ordersData?.refetchData();

    Toast.show({
      type: theme === "light" ? "info" : "infoDark",
      text1: "Zaktualizowano zamówienia",
      text1Style: { textAlign: "center" },
    });

    setRefreshing(false);
  }, [ordersData]);

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
              colors={[colors.primary]}
            />
          }
          estimatedItemSize={10}
        />
      )}
    </>
  );
}

export default memo(OrdersList);
