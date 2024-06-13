import { View } from "react-native";
import { useEffect } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useDataFetch } from "@/hooks/useDataFetch";
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { getCurrentPrice } from "@/api/appwrite/currentPrice";
import tw from "@/lib/twrnc";
import PriceLoadingText from "./Settings/PriceLoadingText";
import CustomButton from "./CustomButton";

export default function CurrentPrice() {
  const { user } = useGlobalContext();
  const { currentPrice, setCurrentPrice, ordersData } = useOrdersContext();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Calculate total price for all visible orders
  const total = ordersData?.data?.reduce(
    (acc, curr) => acc + curr.currentPrice.price * curr.quantity,
    0
  );

  // Fetch current price
  const {
    data: fetchedCurrentPrice,
    isLoading: isPriceLoading,
    refetchData: refetchPrice,
  } = useDataFetch(getCurrentPrice, [], {
    title: "Błąd",
    message: "Nie udało się pobrać aktualnej ceny.",
  });

  const { changeCurrentPrice, isSubmitting } = useCurrentPrice(refetchPrice);

  // Update the current price when the fetchedCurrentPrice is defined
  useEffect(() => {
    if (!fetchedCurrentPrice) return;

    setCurrentPrice(fetchedCurrentPrice);
  }, [fetchedCurrentPrice]);

  return (
    <View style={tw`flex-row justify-between items-center gap-x-4 flex-wrap gap-y-2`}>
      <View style={tw`flex-row items-center gap-x-4`}>
        <PriceLoadingText
          text="Cena:"
          value={currentPrice?.price.toString() || ""}
          isLoading={isPriceLoading}
        />

        {userHasAccess && (
          <CustomButton
            text="Zmień cenę"
            textStyles="text-xs p-3"
            containerStyles="w-[95px] h-[40px]"
            onPress={changeCurrentPrice}
            disabled={currentPrice === null || isSubmitting}
            loading={isSubmitting}
            loadingSpinnerSize="small"
          />
        )}
      </View>

      <PriceLoadingText
        text="Łącznie:"
        value={total?.toString() || ""}
        isLoading={ordersData?.isLoading}
      />
    </View>
  );
}
