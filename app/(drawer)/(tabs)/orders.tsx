import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getOrders } from "@/api/appwrite/orders";
import tw from "@/lib/twrnc";
import OrdersList from "@/components/Orders/OrdersList";
import OrdersHeader from "@/components/Orders/OrdersHeader";
import OrderBottomSheet from "@/components/OrderBottomSheet/OrderBottomSheet";

export default function TabOrders() {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();
  const { ordersData, setOrdersData, ordersSearchParams } = useOrdersContext();

  const errorMessage = {
    title: "Błąd",
    message: "Nie udało się pobrać zamówień. Spróbuj odświeżyć stronę.",
  };

  const appwriteOrdersData = useAppwrite(
    getOrders,
    [
      ordersSearchParams.startDate,
      ordersSearchParams.endDate,
      user && user.role !== "admin" && user.role !== "moderator"
        ? user.$id
        : ordersSearchParams.userId
        ? ordersSearchParams.userId
        : undefined,
    ],
    errorMessage
  );

  // Refetch orders data when search params change
  useEffect(() => {
    appwriteOrdersData.refetchData();
  }, [ordersSearchParams]);

  // Set orders data to the context state if the data is loaded successfully
  useEffect(() => {
    setOrdersData(appwriteOrdersData);
  }, [appwriteOrdersData.isLoading, ordersSearchParams]);

  return (
    <View style={tw`h-full w-[90%] mx-auto`}>
      {user && ordersData && (
        <>
          <View style={tw`h-full`}>
            <OrdersHeader />

            {ordersData.isLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={tw`my-8`}
              />
            ) : (
              <>
                {ordersData.data && ordersData.data.length > 0 ? (
                  <OrdersList />
                ) : (
                  <Text style={tw`text-center font-poppinsRegular text-lg text-[${colors.text}]`}>
                    Brak zamówień
                  </Text>
                )}
              </>
            )}
          </View>
        </>
      )}

      <OrderBottomSheet />
    </View>
  );
}
