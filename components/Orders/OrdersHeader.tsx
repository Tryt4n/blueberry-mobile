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
  const { user, height, isSimplifiedView } = useGlobalContext();
  const { colors } = useThemeContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const { ordersData, ordersSearchParams, isBannerVisible, today } = useOrdersContext();

  return (
    <>
      <View style={tw`${height > 680 ? "mt-8" : "mt-3"} flex flex-row justify-between mb-2`}>
        <Text
          style={tw`font-poppinsBold ${height > 680 ? "text-3xl" : "text-xl"} text-[${
            colors.text
          }]`}
        >
          {user?.role === "admin" || user?.role === "moderator" ? "Zamówienia" : "Twoje zamówienia"}
        </Text>

        {
          // Display the AddButton component if it is not simplified view, or if the selected date is today or later, or if the user is an admin or moderator
          !isSimplifiedView &&
            (ordersSearchParams.startDate >= today ||
              user?.role === "admin" ||
              user?.role === "moderator") && (
              <AddButton
                disabled={ordersData?.isLoading}
                onPress={handleOpenBottomSheet}
                aria-label="Dodaj nowe zamówienie"
              />
            )
        }
      </View>

      <CurrentPrice />

      {!isSimplifiedView && height > 680 && <OpenSearchBannerBtn />}

      <OrdersSearchBanner />

      {!isBannerVisible && <OrdersDateNavigation />}
    </>
  );
}
