import { View } from "react-native";
import React, { useCallback } from "react";
import tw from "@/lib/twrnc";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { editOrder } from "@/api/appwrite/orders";
import Checkbox from "../Checkbox";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";

type OrderCardCompleteCheckboxProps = {
  order: Order;
  setOrder: (order: ((prevState: Order) => Order) | Order) => void;
};

export default function OrderCardCompleteCheckbox({
  order,
  setOrder,
}: OrderCardCompleteCheckboxProps) {
  const { user, showAlert } = useGlobalContext();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Toggle the completed status of the passed order
  const changeCompletedStatus = useCallback(
    async (order: Order) => {
      // If the user is not the creator of the order and doesn't have access, return
      if (user && order.user.$id !== user.$id && !userHasAccess) return;

      try {
        const updatedOrder = {
          userId: order.user.$id,
          buyerId: order.buyer.$id,
          quantity: order.quantity,
          completed: !order.completed,
          additionalInfo: order.additionalInfo,
        };

        // Update the order in the local state for immediate feedback to the user
        setOrder((prevOrder) => ({ ...prevOrder, completed: !prevOrder.completed }));

        // Update the order in the database
        await editOrder(order.$id, updatedOrder);

        // Show a success message to the user
        Toast.show({
          type: "success",
          text1: "Zmieniono status zamówienia na",
          text2: `${order.completed === false ? "ukończone" : "nieukończone"}.`,
          text1Style: { textAlign: "left", fontSize: 16 },
          text2Style: { textAlign: "left", fontSize: 16, fontWeight: "bold", color: "black" },
        });
      } catch (error) {
        // Show an alert to the user if the operation failed
        showAlert("Błąd", "Nie udało się zaktualizować zamówienia.");
      }
    },
    [order, editOrder]
  );

  return (
    <View style={tw`items-end`}>
      <Checkbox
        status={order.completed}
        disabled={order.user.$id !== user?.$id && !userHasAccess}
        onPress={() => changeCompletedStatus(order)}
      />
    </View>
  );
}
