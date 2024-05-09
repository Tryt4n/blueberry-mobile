import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getOrders } from "@/api/appwrite/orders";
import CurrentPrice from "@/components/CurrentPrice";
import OrderCard from "@/components/OrderCard";
import Toast from "react-native-toast-message";

export default function TabOrders() {
  const { user } = useGlobalContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const { currentPrice, ordersData, setOrdersData } = useOrdersContext();
  const [refreshing, setRefreshing] = useState(false);

  const appwriteOrdersData = useAppwrite(
    getOrders,
    user && user.role !== "admin" && user.role !== "moderator" ? [user.$id] : [],
    {
      title: "Błąd",
      message: "Nie udało się pobrać zamówień. Spróbuj odświeżyć stronę.",
    }
  );

  useEffect(() => {
    setOrdersData(appwriteOrdersData);
  }, [appwriteOrdersData.isLoading]);

  async function refetchOrders() {
    setRefreshing(true);

    ordersData && (await ordersData.refetchData());

    Toast.show({
      type: "info",
      text1: "Zaktualizowano zamówienia",
      text1Style: { textAlign: "center", fontSize: 16 },
    });

    setRefreshing(false);
  }

  return (
    <View className="h-full w-[90%] mx-auto">
      {user && ordersData && (
        <>
          <View className="mt-8 flex flex-row justify-between pb-2">
            <Text className="font-poppinsBold text-3xl">
              {user.role === "admin" || user.role === "moderator"
                ? "Zamówienia"
                : "Twoje zamówienia"}
            </Text>

            <TouchableOpacity
              disabled={ordersData.isLoading}
              className="-translate-y-[12px]"
              onPress={handleOpenBottomSheet}
              aria-label="Dodaj nowe zamówienie"
            >
              <Ionicons
                name="add-circle"
                size={48}
                color="rgb(59 130 246)"
              />
            </TouchableOpacity>
          </View>

          <CurrentPrice />

          <View className="h-[80%]">
            {ordersData.isLoading ? (
              <ActivityIndicator
                size="large"
                color="rgb(59 130 246)"
                className="my-8"
              />
            ) : (
              <>
                {ordersData.data && currentPrice && (
                  <>
                    {ordersData.data.length > 0 ? (
                      <FlatList
                        data={ordersData.data}
                        keyExtractor={(order) => order.$id}
                        contentContainerStyle={{
                          paddingHorizontal: 16,
                          paddingBottom:
                            user.role === "admin" || user.role === "moderator" ? 16 : 0,
                        }}
                        renderItem={({ item }) => (
                          <OrderCard
                            order={item}
                            price={currentPrice.price}
                            refetchOrders={ordersData.refetchData}
                          />
                        )}
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refetchOrders}
                          />
                        }
                      />
                    ) : (
                      <Text className="text-center font-poppinsRegular text-lg">Brak zamówień</Text>
                    )}
                  </>
                )}
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}
