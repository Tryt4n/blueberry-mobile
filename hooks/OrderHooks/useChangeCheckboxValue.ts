import { useCallback } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { editOrder } from "@/api/appwrite/orders";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";

export function useChangeCheckboxValue(order: Order, changedValue: "completed" | "issued") {
  const { showAlert } = useGlobalContext();
  const { theme } = useThemeContext();
  const { ordersData } = useOrdersContext();

  // Toggle the checkbox status of the passed order
  const changeCheckboxStatus = useCallback(async () => {
    try {
      const updatedOrder = {
        userId: order.user.$id,
        buyerId: order.buyer.$id,
        quantity: order.quantity,
        completed: changedValue === "completed" ? !order.completed : order.completed,
        additionalInfo: order.additionalInfo,
        issued: changedValue === "issued" ? !order.issued : order.issued,
        deliveryDate: order.deliveryDate,
      };

      // Update the order in the database
      const { errors } = await editOrder(order.$id, updatedOrder);

      if (errors) {
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join("\n"));
      } else {
        // Refetch the orders
        await ordersData?.refetchData();

        // Show a success message to the user
        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: "Zmieniono status zamówienia na",
          //   text2: `${order.completed === false ? "ukończone" : "nieukończone"}.`,
          text2:
            changedValue === "completed"
              ? `${order.completed === false ? "ukończone" : "nieukończone"}.`
              : `${order.issued === false ? "skompletowane" : "nieskompletowane"}.`,
          text2Style: { fontWeight: "bold" },
        });
      }
    } catch (error) {
      // Show an alert to the user if the operation failed
      showAlert("Błąd", "Nie udało się zaktualizować zamówienia.");
    }
  }, [order, editOrder]);

  return changeCheckboxStatus;
}
