import { View, Text, useWindowDimensions } from "react-native";
import { Banner, type BannerProps } from "react-native-paper";
import { useCallback, useMemo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { colors as customColors } from "@/constants/colors";
import tw from "@/lib/twrnc";
import OrdersSearchBannerDates from "./OrdersSearchBannerDates";
import OrdersSearchBannerUser from "./OrdersSearchBannerUser";
import Toast from "react-native-toast-message";

export default function OrdersSearchBanner() {
  const { user } = useGlobalContext();
  const { theme, colors } = useThemeContext();
  const { setModalData, showModal } = useModalContext();
  const { isBannerVisible, setIsBannerVisible, ordersSearchParams, ordersData } =
    useOrdersContext();
  const { width } = useWindowDimensions();

  const containerWidth = useMemo(() => {
    return width * 0.9 - 32 <= 700 ? width * 0.9 - 32 : 700 - 32;
  }, [width]);

  // Fetch new orders based on the selected date range
  const getNewOrders = useCallback(() => {
    if (!ordersSearchParams.startDate && !ordersSearchParams.endDate) {
      setModalData({
        title: "Błąd",
        subtitle: "Wybierz zakres dat przed wyszukaniem.",
        btn1: { text: "Ok" },
      });
      showModal();
      return;
    }
    if (!ordersSearchParams.startDate) {
      setModalData({
        title: "Błąd",
        subtitle: "Wybierz datę początkową.",
        btn1: { text: "Ok" },
      });
      showModal();
      return;
    }
    if (!ordersSearchParams.endDate) {
      setModalData({
        title: "Błąd",
        subtitle: "Wybierz datę końcową.",
        btn1: { text: "Ok" },
      });
      showModal();
      return;
    }

    if (ordersData?.isLoading) return;

    if (ordersData) {
      // Refetch the data with the new parameters
      ordersData.refetchData();

      // Hide the banner
      setIsBannerVisible(false);

      // Show a success message
      Toast.show({
        type: theme === "light" ? "info" : "infoDark",
        text1: "Zamówienia zostały zaktualizowane",
        text2: "o wybrane parametry.",
        text2Style: { fontSize: 14 },
      });
    }
  }, [ordersSearchParams, ordersData, setIsBannerVisible]);

  // Actions for the <Banner /> component
  const bannerActions: BannerProps["actions"] = [
    {
      label: "Schowaj",
      onPress: () => setIsBannerVisible(false),
      labelStyle: { color: colors.text, fontFamily: "Poppins-SemiBold", fontSize: 16 },
    },
    {
      label: "Wyszukaj",
      onPress: getNewOrders,
      labelStyle: {
        color: customColors.primaryLight,
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
      },
    },
  ];

  return (
    <Banner
      visible={isBannerVisible}
      actions={bannerActions}
      elevation={3}
      style={tw`my-4 bg-[${colors.bg}] rounded-2xl w-full max-w-[700px] mx-auto`}
    >
      <Text style={[tw`font-poppinsBold text-[${colors.text}]`, { fontSize: 24 }]}>
        Wyszukaj zamówienia
      </Text>

      <View style={{ width: containerWidth }}>
        <OrdersSearchBannerDates containerWidth={containerWidth} />

        {(user?.role === "admin" || user?.role === "moderator") && <OrdersSearchBannerUser />}
      </View>
    </Banner>
  );
}
