import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "../useGlobalContext";
import { useThemeContext } from "../useThemeContext";
import { useOrdersContext } from "../useOrdersContext";
import { useDataFetch } from "../useDataFetch";
import { useBottomSheetContext } from "../useBottomSheetContext";
import { createOrder, editOrder } from "@/api/appwrite/orders";
import { createNewBuyer, getAllBuyers } from "@/api/appwrite/buyers";
import Toast from "react-native-toast-message";
import type { Buyer } from "@/types/buyers";

export function useOrder() {
  const { user, platform, showAlert } = useGlobalContext();
  const { theme } = useThemeContext();
  const { handleCloseBottomSheet } = useBottomSheetContext();
  const { currentPrice, ordersData, ordersSearchParams, editedOrder, setIsBannerVisible, today } =
    useOrdersContext();

  const initialQuantity = 1;
  const orderDataInitialState = {
    quantity: initialQuantity,
    buyerName: "",
    additionalInfo: "",
    userId: user && user.$id,
    deliveryDate:
      ordersSearchParams.startDate === ordersSearchParams.endDate
        ? ordersSearchParams.startDate
        : today,
  };
  const [quantity, setQuantity] = useState(initialQuantity);
  const [orderData, setOrderData] = useState(orderDataInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all buyers
  const {
    data: buyers,
    isLoading: isLoadingBuyers,
    refetchData: buyersRefetchData,
  } = useDataFetch(getAllBuyers, [], {
    title: "Błąd",
    message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
  });

  const handleOrder = useCallback(async () => {
    // Check if quantity is provided
    if (!orderData.quantity) {
      return showAlert("Błąd zamówienia", "Wprowadź ilość.");
    }

    // Check if buyer name is provided
    if (orderData.buyerName === "") {
      return showAlert("Błąd zamówienia", "Wprowadź nazwę kupującego.");
    }

    // Do nothing and close bottom sheet in edit mode if no changes were made
    if (
      editedOrder &&
      editedOrder.buyer.buyerName === orderData.buyerName &&
      editedOrder.quantity === orderData.quantity &&
      editedOrder.additionalInfo?.trim() === orderData.additionalInfo.trim()
    ) {
      return handleCloseBottomSheet();
    }

    if (user && buyers) {
      setIsSubmitting(true);

      const trimmedBuyerName = orderData.buyerName.replace(/\s+/g, " ").trim().toLowerCase(); // trim and lowercase buyer name
      const existingBuyer = buyers.find((buyer) => buyer.buyerName === trimmedBuyerName); // check if buyer already exists

      try {
        let buyerId: Buyer["$id"];

        // Create new buyer if it doesn't exist
        if (!existingBuyer) {
          const { buyer: newBuyer, error } = await createNewBuyer(
            orderData.buyerName.toLowerCase()
          );

          // Check if new buyer was created successfully and set buyerId to new buyer's id
          if (newBuyer) {
            buyerId = newBuyer.$id;
          } else {
            // Show error alert if new buyer wasn't created
            return showAlert("Błąd zamówienia", `${error.join("\n")}`);
          }
        } else {
          // Set buyerId if buyer already exists
          buyerId = existingBuyer.$id;
        }

        // Check if current price is available and show error alert if not
        if (!currentPrice) {
          return showAlert(
            "Błąd zamówienia",
            "Nie udało się pobrać aktualnej ceny. Spróbuj ponownie."
          );
        }

        // Edit order if in edit mode, otherwise create new order
        const { errors } = editedOrder
          ? await editOrder(editedOrder.$id, {
              userId: editedOrder.user.$id,
              buyerId: buyerId,
              quantity: orderData.quantity,
              completed: editedOrder.completed,
              additionalInfo: orderData.additionalInfo.trim(),
              issued: editedOrder.issued,
              deliveryDate: editedOrder.deliveryDate,
            })
          : await createOrder(
              user.$id,
              buyerId,
              orderData.quantity,
              currentPrice.$id,
              orderData.additionalInfo.trim(),
              orderData.deliveryDate
            );

        // Show error alert if there are any errors, otherwise close bottom sheet and banner, reset search params, show success toast, refetch data for orders and buyers
        if (errors) {
          if (platform === "web") {
            return window.alert(errors.quantity.join("\n"));
          } else {
            return showAlert("Błąd zamówienia", `${errors.quantity.join("\n")}`);
          }
        } else {
          setIsBannerVisible(false);
          handleCloseBottomSheet();
          await ordersData?.refetchData();
          buyersRefetchData();
          Toast.show({
            type: theme === "light" ? "success" : "successDark",
            text1: `Zamówienie zostało ${editedOrder ? "edytowane" : "utworzone"}.`,
          });
        }
      } catch (error) {
        // Show error alert if there was an error during order creation or edition
        if (platform === "web") {
          return window.alert(
            `Nie udało się ${editedOrder ? "edytować" : "utworzyć"} zamówienia. Spróbuj ponownie.`
          );
        } else {
          return showAlert(
            "Błąd",
            `Nie udało się ${editedOrder ? "edytować" : "utworzyć"} zamówienia. Spróbuj ponownie.`
          );
        }
      } finally {
        // Reset states
        setIsSubmitting(false);
        setOrderData(orderDataInitialState);
        setQuantity(1);
      }
    } else {
      // Close bottom sheet if user or buyers are not available
      handleCloseBottomSheet();
    }
  }, [orderData, editedOrder, user, buyers, currentPrice]);

  // Update orderData quantity on quantity change
  useEffect(() => {
    setOrderData({ ...orderData, quantity: quantity });
  }, [quantity]);

  // Update orderData deliveryDate on startDate or endDate change
  useEffect(() => {
    setOrderData({ ...orderData, deliveryDate: orderDataInitialState.deliveryDate });
  }, [ordersSearchParams.startDate, ordersSearchParams.endDate, today]);

  useEffect(() => {
    if (editedOrder) {
      setOrderData({
        quantity: editedOrder.quantity,
        buyerName: editedOrder.buyer.buyerName,
        additionalInfo: editedOrder.additionalInfo || "",
        userId: user && user.$id,
        deliveryDate: editedOrder.deliveryDate,
      });
      setQuantity(editedOrder.quantity);
    } else {
      setOrderData(orderDataInitialState);
      setQuantity(1);
    }
  }, [editedOrder]);

  return {
    orderData,
    changeOrderData: setOrderData,
    changeQuantity: setQuantity,
    handleOrder,
    isSubmittingOrder: isSubmitting,
    buyers,
    isLoadingBuyers,
  };
}
