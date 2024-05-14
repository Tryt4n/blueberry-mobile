import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getOrders } from "@/api/appwrite/orders";
import OrdersList from "@/components/Orders/OrdersList";
import OrdersHeader from "@/components/Orders/OrdersHeader";

export default function TabOrders() {
  const { user } = useGlobalContext();
  const { ordersData, setOrdersData } = useOrdersContext();

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

  return (
    <View className="h-full w-[90%] mx-auto">
      {user && ordersData && (
        <>
          <OrdersHeader />

          <View className="h-[80%]">
            {ordersData.isLoading ? (
              <ActivityIndicator
                size="large"
                color="rgb(59 130 246)"
                className="my-8"
              />
            ) : (
              <>
                {ordersData.data && ordersData.data.length > 0 ? (
                  <OrdersList />
                ) : (
                  <Text className="text-center font-poppinsRegular text-lg">Brak zamówień</Text>
                )}
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}
