import { View, Text } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import AddButton from "../AddButton";
import CurrentPrice from "../CurrentPrice";

export default function OrdersHeader() {
  const { user } = useGlobalContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const { ordersData } = useOrdersContext();

  return (
    <>
      <View className="mt-8 flex flex-row justify-between pb-2">
        <Text className="font-poppinsBold text-3xl">
          {user?.role === "admin" || user?.role === "moderator" ? "Zamówienia" : "Twoje zamówienia"}
        </Text>

        <AddButton
          disabled={ordersData?.isLoading}
          onPress={handleOpenBottomSheet}
          aria-label="Dodaj nowe zamówienie"
        />
      </View>

      <CurrentPrice />
    </>
  );
}
