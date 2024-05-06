import { View, Alert, type TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useOnSubmitEditing } from "@/hooks/useOnSubmitEditing";
import { createNewBuyer, getAllBuyers } from "@/api/appwrite/buyers";
import { createOrder } from "@/api/appwrite/orders";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import { FormField } from "./FormField";
import { QuantityInput } from "./QuantityInput";
import CustomButton from "./CustomButton";
import type { Buyer } from "@/types/buyers";

export default function OrderBottomSheet() {
  const { user } = useGlobalContext();
  const { bottomSheetModalRef, snapPoints, handleCloseBottomSheet, renderBackdrop } =
    useBottomSheetContext();
  const [quantity, setQuantity] = useState(1);
  const newOrderDataInitialState = {
    quantity: quantity,
    buyerName: "",
    additionalInfo: "",
    userId: user && user.$id,
  };
  const { currentPriceId, ordersData } = useOrdersContext();
  const [newOrderData, setNewOrderData] = useState(newOrderDataInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quantityRef = useRef<TextInput>(null);
  const buyerNameRef = useRef<TextInput>(null);

  const {
    data: buyers,
    isLoading: isLoadingBuyers,
    refetchData,
  } = useAppwrite(getAllBuyers, [], {
    title: "Błąd",
    message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
  });

  async function handleCreateOrder() {
    if (!newOrderData.quantity) return Alert.alert("Błąd zamówienia", "Wprowadź ilość.");
    if (newOrderData.buyerName === "")
      return Alert.alert("Błąd zamówienia", "Wprowadź nazwę kupującego.");

    if (user && buyers && newOrderData.quantity && typeof newOrderData.quantity === "number") {
      setIsSubmitting(true);

      const trimmedBuyerName = newOrderData.buyerName.replace(/\s+/g, " ").trim().toLowerCase(); // trim and lowercase buyer name
      const existingBuyer = buyers.find((buyer) => buyer.buyerName === trimmedBuyerName);

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

        if (!currentPriceId)
          return Alert.alert(
            "Błąd zamówienia",
            "Nie udało się pobrać aktualnej ceny. Spróbuj ponownie."
          );

        const { errors } = await createOrder(
          user.$id,
          buyerId,
          newOrderData.quantity,
          currentPriceId,
          newOrderData.additionalInfo
        );

        if (errors) {
          return Alert.alert("Błąd zamówienia", errors.quantity.join("\n"));
        } else {
          handleCloseBottomSheet();
          setNewOrderData(newOrderDataInitialState);
          setQuantity(1);
          ordersData && ordersData.refetchData();
          refetchData();
          Toast.show({
            type: "success",
            text1: "Zamówienie zostało utworzone.",
            text1Style: { textAlign: "center", fontSize: 16 },
          });
        }
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się utworzyć zamówienia. Spróbuj ponownie.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  useEffect(() => {
    setNewOrderData({ ...newOrderData, quantity: quantity });
  }, [quantity]);

  //!
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<Record<"label" | "value", string>[]>([]);

  useEffect(() => {
    buyers && setItems(buyers?.map((buyer) => ({ label: buyer.buyerName, value: buyer.$id })));
  }, [buyers]);
  //!

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
        handleCloseBottomSheet();
      }}
      style={{ paddingHorizontal: 16 }}
    >
      <BottomSheetScrollView>
        <View>
          <QuantityInput
            ref={quantityRef}
            label="Ilość:"
            value={newOrderData.quantity}
            setValue={setQuantity}
            containerStyles="mt-4"
            onSubmitEditing={useOnSubmitEditing(
              isSubmitting,
              newOrderData,
              buyerNameRef,
              handleCreateOrder,
              ["additionalInfo"]
            )}
          />

          <DropDownPicker
            loading={isLoadingBuyers}
            activityIndicatorColor="rgb(59 130 246)"
            listMode="SCROLLVIEW"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            searchable={true}
            autoScroll={true}
            addCustomItem={true}
            closeOnBackPressed={true}
            containerStyle={{ marginVertical: 16 }}
            itemSeparator={true}
            itemSeparatorStyle={{ backgroundColor: "rgb(59 130 246)" }}
            placeholder="Wprowadź nazwę osoby zamawiającej"
            searchPlaceholder="Szukaj..."
            textStyle={{ fontFamily: "Poppins-SemiBold", textTransform: "capitalize" }}
            labelStyle={{ fontSize: 16, fontFamily: "Poppins-Medium" }}
            disabledStyle={{ opacity: 0.5 }}
            onChangeValue={(value) => {
              if (!value) return;
              setNewOrderData({ ...newOrderData, buyerName: value });
            }}
          />

          <FormField
            title="Dodatkowe informacje:"
            placeholder="Jeśli chcesz to możesz dodać dodatkowe informacje do zamówienia"
            maxLength={250}
            value={newOrderData.additionalInfo}
            multiline={true}
            numberOfLines={4}
            handleChangeText={(e) => setNewOrderData({ ...newOrderData, additionalInfo: e })}
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
