import { View, Alert } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { FormField } from "@/components/FormField";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { createOrder } from "@/api/appwrite/orders";

export default function CreateOrderPage() {
  const { user } = useGlobalContext();
  const [newOrderData, setNewOrderData] = useState({
    quantity: 1,
    additionalInfo: "",
    userId: user && user.$id,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateOrder() {
    if (
      user &&
      newOrderData.quantity &&
      typeof newOrderData.quantity === "number" &&
      newOrderData.quantity >= 0.25
    ) {
      setIsSubmitting(true);

      try {
        await createOrder(user.$id, newOrderData.quantity, newOrderData.additionalInfo);
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się utworzyć zamówienia. Spróbuj ponownie.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <View>
      <FormField
        title="Ilość:"
        placeholder="Wprowadź ilość"
        keyboardType="numbers-and-punctuation"
        value={newOrderData.quantity.toString()}
        handleChangeText={(e) => setNewOrderData({ ...newOrderData, quantity: Number(e) })}
      />

      <CustomButton
        text="Utwórz zamówienie"
        onPress={handleCreateOrder}
        loading={isSubmitting}
      />
    </View>
  );
}
