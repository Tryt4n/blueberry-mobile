import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "./useGlobalContext";
import { useModalContext } from "./useModalContext";
import { useOrdersContext } from "./useOrdersContext";
import { useThemeContext } from "./useThemeContext";
import { updatePrice as appwriteUpdatePrice } from "@/api/appwrite/currentPrice";
import Toast from "react-native-toast-message";

export function useCurrentPrice(priceRefetchFn: () => Promise<void>) {
  const { user, showAlert } = useGlobalContext();
  const { theme } = useThemeContext();
  const { showModal, setModalData } = useModalContext();
  const { currentPrice } = useOrdersContext();

  const [modalInputValue, setModalInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  const openModal = useCallback(() => {
    if (!currentPrice) return;

    setModalData({
      title: "Wprowadź nową cenę",
      onDismiss: () => setModalInputValue(currentPrice.price.toString()), // Reset input value on dismiss
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
  }, [currentPrice, showModal, setModalData, modalInputValue, setModalInputValue]);

  const updatePrice = useCallback(async () => {
    if (!userHasAccess) return; // If user doesn't have access, return

    if (!currentPrice) return; // If currentPrice is null, return

    // If modalInputValue is empty, return alert
    if (modalInputValue === "") {
      return showAlert("Błąd", "Wprowadź poprawną cenę.");
    }
    // If price doesn't change, do nothing
    if (modalInputValue === currentPrice.price?.toString()) return;

    setIsSubmitting(true);

    try {
      const updatedPrice = await appwriteUpdatePrice(modalInputValue, currentPrice.$id);

      // If there are errors, show alert and return
      if (updatedPrice.errors) {
        return showAlert("Nieprawidłowa wartość", `${updatedPrice.errors?.join("\n")}`);
      }

      // Else show success toast and refetch price
      await priceRefetchFn();
      Toast.show({
        type: theme === "light" ? "success" : "successDark",
        text1: "Cena została zaktualizowana.",
      });
    } catch (error: any) {
      setModalData({
        title: "Błąd",
        subtitle: "Nie udało się zaktualizować ceny.",
        btn1: { text: "Ok" },
      });
      showModal();
    } finally {
      setIsSubmitting(false);
    }
  }, [modalInputValue]);

  // Set the modal input value to the current price when the current price changes
  useEffect(() => {
    if (!currentPrice) return;

    setModalInputValue(currentPrice.price.toString());
  }, [currentPrice]);

  // Update the updatePrice function in the modal data when the input value changes
  useEffect(() => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      btn2: {
        ...prevModalData.btn2,
        onPress: updatePrice,
      },
    }));
  }, [modalInputValue]);

  return { changeCurrentPrice: openModal, isSubmitting };
}
