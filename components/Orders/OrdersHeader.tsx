import { View, Text } from "react-native";
import tw from "@/lib/twrnc";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import AddButton from "../AddButton";
import CurrentPrice from "../CurrentPrice";
import OpenSearchBannerBtn from "./OpenSearchBannerBtn";
import OrdersSearchBanner from "./OrdersSearchBanner";

export default function OrdersHeader() {
  const { user } = useGlobalContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const { ordersData } = useOrdersContext();

  return (
    <>
      <View style={tw`mt-8 flex flex-row justify-between mb-2`}>
        <Text style={tw`font-poppinsBold text-3xl`}>
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
    </>
  );
}
