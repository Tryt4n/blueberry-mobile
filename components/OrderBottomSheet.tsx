import { View, Alert } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { createNewBuyer, getAllBuyers } from "@/api/appwrite/buyers";
import { createOrder } from "@/api/appwrite/orders";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FormField } from "./FormField";
import CustomButton from "./CustomButton";
import type { Buyer } from "@/types/buyers";

export default function OrderBottomSheet() {
  const { user } = useGlobalContext();
  const { bottomSheetModalRef, snapPoints, handleClosePress, renderBackdrop } =
    useBottomSheetContext();
  const newOrderDataInitialState = {
    quantity: 1,
    buyerName: "",
    additionalInfo: "",
    userId: user && user.$id,
  };
  const [newOrderData, setNewOrderData] = useState(newOrderDataInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: buyers,
    isLoading,
    refetchData,
  } = useAppwrite(getAllBuyers, {
    title: "Błąd",
    message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
  });

  async function handleCreateOrder() {
    if (!newOrderData.quantity) return Alert.alert("Błąd zamówienia", "Wprowadź ilość.");
    if (newOrderData.buyerName === "")
      return Alert.alert("Błąd zamówienia", "Wprowadź nazwę kupującego.");

    if (user && buyers && newOrderData.quantity && typeof newOrderData.quantity === "number") {
      setIsSubmitting(true);

      const existingBuyer = buyers.find((buyer) => buyer.buyerName === newOrderData.buyerName);

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

        const { errors } = await createOrder(
          user.$id,
          buyerId,
          newOrderData.quantity,
          newOrderData.additionalInfo
        );

        if (errors) {
          return Alert.alert("Błąd zamówienia", errors.quantity.join("\n"));
        } else {
          handleClosePress();
          setNewOrderData(newOrderDataInitialState);
          refetchData();
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
      onClose={handleClosePress}
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
