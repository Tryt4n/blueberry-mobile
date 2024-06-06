import { useCallback, useEffect } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { changeOrderPrice as changeOrderPriceAppwrite } from "@/api/appwrite/orders";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";

export function useChangeOrderPrice(
  order: Order,
  modalInputValue: string,
  setModalInputValue: (text: string) => void
) {
  const { user, showAlert } = useGlobalContext();
  const { theme } = useThemeContext();
  const { ordersData, setEditedOrder } = useOrdersContext();
  const { setModalData, showModal } = useModalContext();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Open the modal with the input to change the order price
  const openChangePriceModal = useCallback(() => {
    if (userHasAccess) {
      setEditedOrder(order);
      setModalData({
        title: "Edycja ceny",
        subtitle: "Wprowadź nową cenę dla zamówienia.",
        btn1: {
          text: "Anuluj",
        },
        btn2: {
          text: "Zapisz",
          color: "primary",
        },
        input: {
          maxLength: 4,
          keyboardType: "number-pad",
          defaultValue: modalInputValue,
          onChangeText: (text) => setModalInputValue(text),
        },
      });
      showModal();
    }
  }, [setModalData, showModal, setEditedOrder, modalInputValue, setModalInputValue]);

  // Change the price of the order
  const changeOrderPrice = useCallback(async () => {
    try {
      const errors = await changeOrderPriceAppwrite(order.$id, modalInputValue);

      // If there are errors, show alert with those errors, reset input value and return
      if (errors) {
        setModalInputValue(order.currentPrice.price.toString());
        return showAlert("Nieprawidłowa wartość", errors.join("\n"));
      } else {
        // If there are no errors refetch the orders data and show success message
        await ordersData?.refetchData();
        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: `Zmieniono cenę zamówienia na ${modalInputValue} zł`,
          text2Style: { fontWeight: "bold" },
        });
      }
    } catch (error) {
      // If there was an error, show alert
      return showAlert("Błąd", "Nie udało się zmienić ceny zamówienia.");
    }
  }, [modalInputValue]);

  // Update the onPress function of the confirmation button in the modal data when the input value changes
  useEffect(() => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      btn2: {
        ...prevModalData.btn2,
        onPress: changeOrderPrice,
      },
    }));
  }, [modalInputValue]);

  return openChangePriceModal;
}
