import { useCallback } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import { editOrder } from "@/api/appwrite/orders";
import { formatDate } from "@/helpers/dates";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";

export function useChangeOrderDate(order: Order) {
  const { user, showAlert } = useGlobalContext();
  const { theme, colors } = useThemeContext();
  const { ordersData, today } = useOrdersContext();
  const { setModalData, showModal, closeModal } = useModalContext();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Open the modal with the calendar to change the order delivery date
  const openCalendarModal = useCallback(() => {
    setModalData({
      title: "Zmień datę dostawy zamówienia",
      btn1: {
        text: "Anuluj",
        color: "danger",
      },
      calendar: {
        minDate: !userHasAccess ? today : undefined, // If the user has access, allow to select any date otherwise only today or future dates
        markedDates: {
          [order.deliveryDate]: {
            selected: true,
            selectedColor: colors.primary,
          },
        },
        onDayPress: (day) => editOrderDate(day.dateString),
      },
    });
    showModal();
  }, [order.deliveryDate, today, userHasAccess, showModal]);

  const editOrderDate = useCallback(async (deliveryDate: string) => {
    try {
      closeModal();
      const { order: changedOrder } = await editOrder(order.$id, {
        userId: order.user.$id,
        buyerId: order.buyer.$id,
        quantity: order.quantity,
        completed: order.completed,
        additionalInfo: order.additionalInfo,
        issued: order.issued,
        deliveryDate: deliveryDate,
      });

      if (changedOrder) {
        await ordersData?.refetchData();
        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: "Zmieniono datę dostawy",
          text2: `zamówienia na ${formatDate(deliveryDate, "dd.MM.yyyy")}`,
          text2Style: { fontWeight: "bold" },
        });
      } else {
        throw new Error("Nie udało się zmienić daty dostawy zamówienia.");
      }
    } catch (error: any) {
      showAlert("Błąd", error);
    }
  }, []);

  return openCalendarModal;
}
