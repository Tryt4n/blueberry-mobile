import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { getOrders } from "@/api/appwrite/orders";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

export default function TabOrders() {
  const { user } = useGlobalContext();
  const { handleOpenPress } = useBottomSheetContext();
  const {
    data: orders,
    isLoading,
    refetchData,
  } = useAppwrite(getOrders, {
    title: "Błąd",
    message: "Nie udało się pobrać zamówień. Spróbuj odświeżyć stronę.",
  });
  const [refreshing, setRefreshing] = useState(false);

  async function refetchOrders() {
    setRefreshing(true);

    await refetchData();

    setRefreshing(false);
  }

  return (
    <View className="h-full w-[90%] mx-auto">
      <View className="mt-8 flex flex-row justify-between pb-2">
        <Text className="font-poppinsBold text-3xl">Zamówienia</Text>

        {user && (user.role === "admin" || user.role === "moderator" || user.role === "seller") && (
          <TouchableOpacity
            disabled={isLoading}
            className="-translate-y-[12px]"
            onPress={handleOpenPress}
            aria-label="Dodaj nowe zamówienie"
          >
            <Ionicons
              name="add-circle"
              size={48}
              color="rgb(59 130 246)"
            />
          </TouchableOpacity>
        )}
      </View>
      <Text className="font-poppinsRegular text-base">
        Cena: <Text className="font-poppinsMedium text-xl">13 zł</Text>
      </Text>

      <View className="my-4 h-[75%]">
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
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                  <View>
                    <Text>Ilość: {item.quantity}</Text>
                    <Text>Dla: {item.buyer.buyerName}</Text>
                    <Text>Ukończone: {item.completed ? "Tak" : "Nie"}</Text>
                    {item.additionalInfo && (
                      <Text>Informacje dodatkowe: {item.additionalInfo}</Text>
                    )}
                    <View>
                      <Text>
                        Dodano przez <Text>{item.user.username}</Text>
                      </Text>
                      <Text>
                        {formatDistanceToNow(item.$createdAt, {
                          addSuffix: true,
                          locale: pl,
                        })}
                      </Text>
                    </View>
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refetchOrders}
                  />
                }
                className="p-2 border rounded-lg"
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}
