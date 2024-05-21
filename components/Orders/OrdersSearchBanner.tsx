import { View, Text, Dimensions, Alert } from "react-native";
import { Banner, type BannerProps } from "react-native-paper";
import tw from "@/lib/twrnc";
import { colors } from "@/helpers/colors";
import { useCallback } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import OrdersSearchBannerDates from "./OrdersSearchBannerDates";
import OrdersSearchBannerUser from "./OrdersSearchBannerUser";
import Toast from "react-native-toast-message";

export default function OrdersSearchBanner() {
  const { user } = useGlobalContext();
  const { isBannerVisible, setIsBannerVisible, ordersSearchParams, ordersData } =
    useOrdersContext();

  const { width } = Dimensions.get("window");
  const containerWidth = width * 0.9 - 32;

  // Fetch new orders based on the selected date range
  const getNewOrders = useCallback(() => {
    if (!ordersSearchParams.startDate && !ordersSearchParams.endDate) {
      return Alert.alert("Błąd", "Wybierz zakres dat przed wyszukaniem.");
    }
    if (!ordersSearchParams.startDate) {
      return Alert.alert("Błąd", "Wybierz datę początkową.");
    }
    if (!ordersSearchParams.endDate) {
      return Alert.alert("Błąd", "Wybierz datę końcową.");
    }

    if (ordersData?.isLoading) return;

    if (ordersData) {
      // Refetch the data with the new parameters
      ordersData.refetchData();

      // Hide the banner
      setIsBannerVisible(false);

      // Show a success message
      Toast.show({
        type: "info",
        text1: "Zamówienia zostały zaktualizowane",
        text2: "o wybrane parametry.",
        text1Style: { textAlign: "left", fontSize: 16 },
        text2Style: { textAlign: "left", fontSize: 14 },
      });
    }
  }, [ordersSearchParams, ordersData, setIsBannerVisible]);

  // Actions for the <Banner /> component
  const bannerActions: BannerProps["actions"] = [
    {
      label: "Schowaj",
      onPress: () => setIsBannerVisible(false),
      labelStyle: { color: "black", fontFamily: "Poppins-SemiBold", fontSize: 16 },
    },
    {
      label: "Wyszukaj",
      onPress: getNewOrders,
      labelStyle: { color: colors.primary, fontFamily: "Poppins-SemiBold", fontSize: 16 },
    },
  ];

  return (
    <Banner
      visible={isBannerVisible}
      actions={bannerActions}
      elevation={3}
      style={tw`my-4 bg-white rounded-2xl`}
    >
      <Text style={[tw`font-poppinsBold`, { fontSize: 24 }]}>Wyszukaj zamówienia</Text>
      <View style={{ width: containerWidth }}>
        <OrdersSearchBannerDates containerWidth={containerWidth} />

        {(user?.role === "admin" || user?.role === "moderator") && <OrdersSearchBannerUser />}
      </View>
    </Banner>
  );
}
