import { View, Alert, Text, Dimensions, type TextInput } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { createNewBuyer, getAllBuyers } from "@/api/appwrite/buyers";
import { createOrder, editOrder } from "@/api/appwrite/orders";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { FormField } from "../FormField";
import { QuantityInput } from "./QuantityInput";
import { BuyersDropDownPicker } from "./BuyersDropDownPicker";
import CustomButton from "../CustomButton";
import type { Buyer } from "@/types/buyers";
import type { ValueType } from "react-native-dropdown-picker";

export default function OrderBottomSheet() {
  const { user } = useGlobalContext();
  const { bottomSheetModalRef, snapPoints, handleCloseBottomSheet, renderBackdrop } =
    useBottomSheetContext();
  const [quantity, setQuantity] = useState(1);
  const orderDataInitialState = {
    quantity: quantity,
    buyerName: "",
    additionalInfo: "",
    userId: user && user.$id,
  };
  const { currentPrice, ordersData, editedOrder, setEditedOrder } = useOrdersContext();
  const [orderData, setOrderData] = useState(orderDataInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quantityRef = useRef<TextInput>(null);
  const buyerNameRef = useRef<TextInput>(null);
  const additionalInfoRef = useRef<TextInput>(null);

  // Fetch all buyers
  const {
    data: buyers,
    isLoading: isLoadingBuyers,
    refetchData: buyersRefetchData,
  } = useAppwrite(getAllBuyers, [], {
    title: "Błąd",
    message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
  });

  async function handleOrder() {
    // Check if quantity is provided
    if (!orderData.quantity) return Alert.alert("Błąd zamówienia", "Wprowadź ilość.");

    // Check if buyer name is provided
    if (orderData.buyerName === "")
      return Alert.alert("Błąd zamówienia", "Wprowadź nazwę kupującego.");

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
            return Alert.alert("Błąd zamówienia", error.join("\n"));
          }
        } else {
          // Set buyerId if buyer already exists
          buyerId = existingBuyer.$id;
        }

        // Check if current price is available and show error alert if not
        if (!currentPrice) {
          return Alert.alert(
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
            })
          : await createOrder(
              user.$id,
              buyerId,
              orderData.quantity,
              currentPrice.$id,
              orderData.additionalInfo.trim()
            );

        // Show error alert if there are any errors, otherwise close bottom sheet, show success toast, refetch data for orders and buyers
        if (errors) {
          return Alert.alert("Błąd zamówienia", errors.quantity.join("\n"));
        } else {
          handleCloseBottomSheet();
          ordersData && ordersData.refetchData();
          buyersRefetchData();
          Toast.show({
            type: "success",
            text1: `Zamówienie zostało ${editedOrder ? "edytowane" : "utworzone"}.`,
            text1Style: { textAlign: "left", fontSize: 16 },
          });
        }
      } catch (error) {
        // Show error alert if there was an error during order creation or edition
        Alert.alert(
          "Błąd",
          `Nie udało się ${editedOrder ? "edytować" : "utworzyć"} zamówienia. Spróbuj ponownie.`
        );
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
  }

  useEffect(() => {
    setOrderData({ ...orderData, quantity: quantity });
  }, [quantity]);

  useEffect(() => {
    if (editedOrder) {
      setOrderData({
        quantity: editedOrder.quantity,
        buyerName: editedOrder.buyer.buyerName,
        additionalInfo: editedOrder.additionalInfo || "",
        userId: user && user.$id,
      });
      setQuantity(editedOrder.quantity);
    } else {
      setOrderData(orderDataInitialState);
      setQuantity(1);
    }
  }, [editedOrder]);

  const dropdownHeight = useMemo(() => {
    return Dimensions.get("window").height * 0.375;
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetModalRef}
      index={-1}
      snapPoints={snapPoints}
      enableContentPanningGesture={false}
      keyboardBehavior="extend"
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: "rgb(59 130 246)" }}
      backdropComponent={renderBackdrop}
      onClose={() => {
        quantityRef.current?.blur();
        buyerNameRef.current?.blur();
        additionalInfoRef.current?.blur();
        handleCloseBottomSheet();
        setEditedOrder(null);
        setQuantity(1);
      }}
      style={{
        paddingHorizontal: 16,
      }}
    >
      <BottomSheetScrollView>
        <View style={{ minHeight: dropdownHeight + 160, zIndex: 1 }}>
          <Text className="font-poppinsSemiBold text-lg my-4 text-center">
            {`${editedOrder ? "Edytuj " : "Dodaj nowe"} zamówienie`}
          </Text>

          <QuantityInput
            ref={quantityRef}
            label="Ilość:"
            value={orderData.quantity}
            setValue={setQuantity}
          />

          <BuyersDropDownPicker
            ref={buyerNameRef}
            defaultValue={editedOrder ? editedOrder.buyer.buyerName : undefined}
            dropDownHeight={dropdownHeight}
            label="Kupujący:"
            buyers={buyers}
            loading={isLoadingBuyers}
            onChangeValue={(value: ValueType | null) => {
              if (!value) return;
              setOrderData({ ...orderData, buyerName: value as string });
            }}
          />

          <FormField
            ref={additionalInfoRef}
            title="Dodatkowe informacje:"
            placeholder="Jeśli chcesz to możesz dodać dodatkowe informacje do zamówienia"
            maxLength={250}
            value={orderData.additionalInfo}
            multiline={true}
            numberOfLines={4}
            handleChangeText={(e) => setOrderData({ ...orderData, additionalInfo: e })}
          />
        </View>

        <CustomButton
          text={editedOrder ? "Zapisz zmiany" : "Utwórz zamówienie"}
          onPress={handleOrder}
          loading={isSubmitting}
          containerStyles="mb-8"
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}