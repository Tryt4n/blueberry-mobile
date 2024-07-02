import { FlashList } from "@shopify/flash-list";
import { RefreshControl, useWindowDimensions } from "react-native";
import { useCallback, useState, memo, useMemo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import OrderCard from "./OrderCard";
import SimplifiedAddOrderSection from "./SimplifiedAddOrderSection";
import Toast from "react-native-toast-message";

function OrdersList() {
  const { platform, isSimplifiedView } = useGlobalContext();
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

  // Preparing data for FlashList
  const dataList = useMemo(() => {
    if (!ordersData || ordersData?.isLoading || !ordersData.data || ordersData.data.length < 1)
      return [];

    // If the view is simplified, add a special element at the beginning
    if (isSimplifiedView && currentPrice) {
      return [{ isSimplifiedCard: true, price: currentPrice.price }, ...ordersData.data];
    }
    return ordersData.data;
  }, [isSimplifiedView, currentPrice, ordersData]);

  return (
    <>
      <FlashList
        data={dataList}
        keyExtractor={(item, index) =>
          "isSimplifiedCard" in item ? `simplified-${index}` : item.$id
        }
        horizontal={platform === "web" && width > 700 ? false : undefined}
        numColumns={platform === "web" ? (width >= 1400 ? 3 : width >= 700 ? 2 : 1) : undefined}
        renderItem={({ item, index }) => {
          if ("isSimplifiedCard" in item) {
            return <SimplifiedAddOrderSection />;
          }

          // Default OrderCard rendering
          return (
            <OrderCard
              order={item}
              price={currentPrice?.price || null}
              additionalStyles={platform === "web" && width > 700 ? "max-w-[95%] mr-4" : ""}
              index={index}
            />
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetchOrders}
            colors={[colors.primary]}
          />
        }
        estimatedItemSize={10}
      />
    </>
  );
}

export default memo(OrdersList);
