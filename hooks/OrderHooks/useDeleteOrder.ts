import { useCallback } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { deleteOrder as deleteOrderAppwrite } from "@/api/appwrite/orders";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";

export function useDeleteOrder(orderId: Order["$id"], orderCreatorId: Order["user"]["$id"]) {
  const { user, showAlert } = useGlobalContext();
  const { theme } = useThemeContext();
  const { ordersData } = useOrdersContext();
  const { setModalData, showModal } = useModalContext();

  const deleteOrder = useCallback(
    async (orderId: Order["$id"]) => {
      try {
        await deleteOrderAppwrite(orderId).then(async () => {
          await ordersData?.refetchData();
          Toast.show({
            type: theme === "light" ? "success" : "successDark",
            text1: "Zamówienie zostało pomyślnie",
            text2: "usunięte.",
            text2Style: { fontWeight: "bold" },
          });
        });
      } catch (error) {
        showAlert("Błąd", "Nie udało się usunąć zamówienia.");
      }
    },
    [deleteOrderAppwrite]
  );

  // Open the modal with the delete confirmation
  const openDeleteModalConfirmation = useCallback(() => {
    if (
      user &&
      (user.$id === orderCreatorId || user?.role === "admin" || user?.role === "moderator")
    ) {
      setModalData({
        title: "Usuwanie zamówienia",
        subtitle: "Czy na pewno chcesz usunąć zamówienie?",
        btn1: {
          text: "Usuń",
          color: "danger",
          onPress: async () => await deleteOrder(orderId),
        },
        btn2: {
          text: "Anuluj",
          color: "primary",
        },
      });
      showModal();
    }
  }, [user, deleteOrder, showModal]);

  return openDeleteModalConfirmation;
}
