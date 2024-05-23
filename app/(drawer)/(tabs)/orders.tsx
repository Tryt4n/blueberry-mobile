import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "@/lib/twrnc";
import { colors } from "@/helpers/colors";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getOrders, getOrdersBySearchParams } from "@/api/appwrite/orders";
import OrdersList from "@/components/Orders/OrdersList";
import OrdersHeader from "@/components/Orders/OrdersHeader";
import CustomButton from "@/components/CustomButton";
import OrderBottomSheet from "@/components/OrderBottomSheet/OrderBottomSheet";

export default function TabOrders() {
  const { user } = useGlobalContext();
  const { ordersData, setOrdersData, ordersSearchParams, setOrdersSearchParams, isBannerVisible } =
    useOrdersContext();
  const [isOrdersSearchParamsReset, setIsOrdersSearchParamsReset] = useState(false);

  const errorMessage = {
    title: "Błąd",
    message: "Nie udało się pobrać zamówień. Spróbuj odświeżyć stronę.",
  };

  const appwriteOrdersData =
    // If search params are provided, fetch orders by search params
    ordersSearchParams?.startDate && ordersSearchParams?.endDate
      ? useAppwrite(
          getOrdersBySearchParams,
          [
            ordersSearchParams.startDate,
            ordersSearchParams.endDate,
            // If user is not admin or moderator, fetch orders only for the logged in user
            user && user.role !== "admin" && user.role !== "moderator"
              ? user.$id
              : ordersSearchParams.userId
              ? ordersSearchParams.userId
              : undefined,
          ],
          errorMessage
        )
      : // else fetch all orders
        useAppwrite(
          getOrders,
          // If user is not admin or moderator, fetch orders only for the logged in user
          user && user.role !== "admin" && user.role !== "moderator" ? [user.$id] : [],
          errorMessage
        );

  useEffect(() => {
    // Fetch orders and set the data to the context state if the data is loaded successfully
    setOrdersData(appwriteOrdersData);
  }, [appwriteOrdersData.isLoading, ordersSearchParams]);

  useEffect(() => {
    if (ordersData?.isLoading) {
      return setIsOrdersSearchParamsReset(false);
    }

    // Reset search parameters if there are no orders with the searched parameters
    if (
      !ordersData?.isLoading &&
      ordersData &&
      ordersData.data &&
      ordersData.data.length === 0 &&
      ordersSearchParams.startDate &&
      ordersSearchParams.endDate &&
      !isBannerVisible // This condition prevents the `ordersSearchParams` from being reset before the user presses the search button
    ) {
      setOrdersSearchParams({ startDate: undefined, endDate: undefined, userId: undefined });
      setIsOrdersSearchParamsReset(true);
    }
  }, [ordersData, ordersSearchParams]);

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
                  <>
                    <Text style={tw`text-center font-poppinsRegular text-lg`}>{`Brak zamówień${
                      isOrdersSearchParamsReset ? " o określonych parametrach wyszukiwania." : ""
                    }`}</Text>

                    {ordersData &&
                      ordersData.data &&
                      ordersData.data.length === 0 &&
                      !ordersSearchParams.startDate &&
                      !ordersSearchParams.endDate &&
                      !isBannerVisible &&
                      isOrdersSearchParamsReset && (
                        <CustomButton
                          text="Resetuj parametry wyszukiwania"
                          onPress={() => ordersData.refetchData()}
                          containerStyles="mt-4"
                        />
                      )}
                  </>
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
