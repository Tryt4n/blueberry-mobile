import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { getOrders } from "@/api/appwrite/orders";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import OrderCard from "@/components/OrderCard";
import CustomButton from "@/components/CustomButton";

export default function TabOrders() {
  const { user } = useGlobalContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const currentPrice = 13;
  const {
    data: orders,
    isLoading,
    refetchData,
  } = useAppwrite(
    getOrders,
    (user && user.role !== "admin") || (user && user.role !== "moderator") ? [user.$id] : [],
    {
      title: "Błąd",
      message: "Nie udało się pobrać zamówień. Spróbuj odświeżyć stronę.",
    }
  );
  const [refreshing, setRefreshing] = useState(false);

  async function refetchOrders() {
    setRefreshing(true);

    await refetchData();

    setRefreshing(false);
  }

  return (
    <View className="h-full w-[90%] mx-auto">
      {user && (user.role === "admin" || user.role === "moderator" || user.role === "seller") && (
        <>
          <View className="mt-8 flex flex-row justify-between pb-2">
            <Text className="font-poppinsBold text-3xl">Zamówienia</Text>

            <TouchableOpacity
              disabled={isLoading}
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

          <View className="flex-row items-center gap-4 mb-4">
            <Text className="font-poppinsRegular text-base">
              Cena: <Text className="font-poppinsMedium text-xl">{currentPrice} zł</Text>
            </Text>
            {(user.role === "admin" || user.role === "moderator") && (
              <CustomButton
                text="Zmień cenę"
                containerStyles=""
                textStyles="text-xs p-3"
              />
            )}
          </View>

          <View className="h-[80%]">
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="rgb(59 130 246)"
                className="my-8"
              />
            ) : (
              <>
                {orders && orders.length > 0 && (
                  <FlatList
                    data={orders}
                    keyExtractor={(order) => order.$id}
                    contentContainerStyle={{
                      paddingHorizontal: 16,
                      paddingBottom: user.role === "admin" || user.role === "moderator" ? 16 : 0,
                    }}
                    renderItem={({ item }) => (
                      <OrderCard
                        order={item}
                        refetchOrders={refetchData}
                      />
                    )}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refetchOrders}
                      />
                    }
                  />
                )}
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}
