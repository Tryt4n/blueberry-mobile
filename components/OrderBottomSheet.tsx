import { View, Alert } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { createNewBuyer, getAllBuyers } from "@/api/appwrite/buyers";
import { createOrder } from "@/api/appwrite/orders";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FormField } from "./FormField";
import CustomButton from "./CustomButton";
import type { Buyer } from "@/types/buyers";
import Toast from "react-native-toast-message";

export default function OrderBottomSheet() {
  const { user } = useGlobalContext();
  const { bottomSheetModalRef, snapPoints, handleCloseBottomSheet, renderBackdrop } =
    useBottomSheetContext();
  const newOrderDataInitialState = {
    quantity: 1,
    buyerName: "",
    additionalInfo: "",
    userId: user && user.$id,
  };
  const { currentPriceId, ordersData } = useOrdersContext();
  const [newOrderData, setNewOrderData] = useState(newOrderDataInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: buyers,
    isLoading,
    refetchData,
  } = useAppwrite(getAllBuyers, [], {
    title: "Błąd",
    message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
  });

  async function handleCreateOrder() {
    if (!newOrderData.quantity) return Alert.alert("Błąd zamówienia", "Wprowadź ilość.");
    if (newOrderData.buyerName === "")
      return Alert.alert("Błąd zamówienia", "Wprowadź nazwę kupującego.");

    if (user && buyers && newOrderData.quantity && typeof newOrderData.quantity === "number") {
      setIsSubmitting(true);

      const trimmedBuyerName = newOrderData.buyerName.replace(/\s+/g, " ").trim().toLowerCase(); // trim and lowercase buyer name
      const existingBuyer = buyers.find((buyer) => buyer.buyerName === trimmedBuyerName);

      try {
        let buyerId: Buyer["$id"];
        if (!existingBuyer) {
          const { buyer: newBuyer, error } = await createNewBuyer(
            newOrderData.buyerName.toLowerCase()
          );

          if (newBuyer) {
            buyerId = newBuyer.$id;
          } else {
            return Alert.alert("Błąd zamówienia", error.join("\n"));
          }
        } else {
          buyerId = existingBuyer.$id;
        }

        if (!currentPriceId)
          return Alert.alert(
            "Błąd zamówienia",
            "Nie udało się pobrać aktualnej ceny. Spróbuj ponownie."
          );

        const { errors } = await createOrder(
          user.$id,
          buyerId,
          newOrderData.quantity,
          currentPriceId,
          newOrderData.additionalInfo
        );

        if (errors) {
          return Alert.alert("Błąd zamówienia", errors.quantity.join("\n"));
        } else {
          handleCloseBottomSheet();
          setNewOrderData(newOrderDataInitialState);
          ordersData && ordersData.refetchData();
          refetchData();
          Toast.show({
            type: "success",
            text1: "Zamówienie zostało utworzone.",
            text1Style: { textAlign: "center", fontSize: 16 },
          });
        }
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się utworzyć zamówienia. Spróbuj ponownie.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <BottomSheet
      ref={bottomSheetModalRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: "rgb(59 130 246)" }}
      backdropComponent={renderBackdrop}
      onClose={handleCloseBottomSheet}
      style={{ paddingHorizontal: 16 }}
    >
      <BottomSheetScrollView>
        <View>
          <FormField
            title="Ilość:"
            placeholder="Wprowadź ilość"
            keyboardType="number-pad"
            value={newOrderData.quantity.toString()}
            handleChangeText={(e) => setNewOrderData({ ...newOrderData, quantity: Number(e) })}
          />

          <FormField
            title="Dla:"
            placeholder="Wprowadź nazwę osoby zamawiającej"
            value={newOrderData.buyerName}
            handleChangeText={(e) => setNewOrderData({ ...newOrderData, buyerName: e })}
          />

          <CustomButton
            text="Utwórz zamówienie"
            onPress={handleCreateOrder}
            loading={isSubmitting}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
