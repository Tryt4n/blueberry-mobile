import { View, Text } from "react-native";
import tw from "@/lib/twrnc";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import AddButton from "../AddButton";
import CurrentPrice from "../CurrentPrice";
import OpenSearchBannerBtn from "./OpenSearchBannerBtn";
import OrdersSearchBanner from "./OrdersSearchBanner";
import OrdersDateNavigation from "./OrdersDateNavigation";

export default function OrdersHeader() {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const { ordersData, isBannerVisible } = useOrdersContext();

  return (
    <>
      <View style={tw`mt-8 flex flex-row justify-between mb-2`}>
        <Text style={tw`font-poppinsBold text-3xl text-[${colors.text}]`}>
          {user?.role === "admin" || user?.role === "moderator" ? "Zamówienia" : "Twoje zamówienia"}
        </Text>

        <AddButton
          disabled={ordersData?.isLoading}
          onPress={handleOpenBottomSheet}
          aria-label="Dodaj nowe zamówienie"
        />
      </View>

      <CurrentPrice />

      <OpenSearchBannerBtn />

      <OrdersSearchBanner />

      {!isBannerVisible && <OrdersDateNavigation />}
    </>
  );
}
