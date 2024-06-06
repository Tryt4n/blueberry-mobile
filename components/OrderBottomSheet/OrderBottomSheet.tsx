import { View, Text, type TextInput } from "react-native";
import React, { useRef } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useOrder } from "@/hooks/OrderHooks/useOrder";
import tw from "@/lib/twrnc";
import ActionSheet, { ScrollView } from "react-native-actions-sheet";
import { QuantityInput } from "./QuantityInput";
import { BuyersDropDownPicker } from "./BuyersDropDownPicker";
import { FormField } from "../FormField";
import CustomButton from "../CustomButton";
import type { ValueType } from "react-native-dropdown-picker";

export default function OrderBottomSheet() {
  const { colors } = useThemeContext();
  const { bottomSheetModalRef, handleCloseBottomSheet } = useBottomSheetContext();
  const { editedOrder, setEditedOrder } = useOrdersContext();

  const quantityRef = useRef<TextInput>(null);
  const buyerNameRef = useRef<TextInput>(null);
  const additionalInfoRef = useRef<TextInput>(null);

  const {
    handleOrder,
    orderData,
    changeOrderData,
    changeQuantity,
    isSubmittingOrder,
    buyers,
    isLoadingBuyers,
  } = useOrder();

  return (
    <ActionSheet
      ref={bottomSheetModalRef}
      onClose={() => {
        quantityRef.current?.blur();
        buyerNameRef.current?.blur();
        additionalInfoRef.current?.blur();
        handleCloseBottomSheet();
        setEditedOrder(null);
        changeQuantity(1);
      }}
      useBottomSafeAreaPadding={true}
      gestureEnabled={true}
      defaultOverlayOpacity={0.5}
      indicatorStyle={tw`bg-[${colors.primary}] my-4`}
      containerStyle={tw`w-full max-w-[700px] px-4 bg-[${colors.bg}]`}
    >
      <ScrollView>
        <View>
          <Text style={tw`font-poppinsSemiBold text-lg mb-4 text-center text-[${colors.text}]`}>
            {`${editedOrder ? "Edytuj " : "Dodaj nowe"} zamówienie`}
          </Text>

          <QuantityInput
            ref={quantityRef}
            label="Ilość:"
            value={orderData.quantity}
            setValue={changeQuantity}
          />

          <BuyersDropDownPicker
            ref={buyerNameRef}
            defaultValue={editedOrder ? editedOrder.buyer.buyerName : undefined}
            buyers={buyers}
            loading={isLoadingBuyers}
            onChangeValue={(value: ValueType | null) => {
              if (!value) return;
              changeOrderData({ ...orderData, buyerName: value as string });
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
            handleChangeText={(e) => changeOrderData({ ...orderData, additionalInfo: e })}
          />
        </View>

        <CustomButton
          text={editedOrder ? "Zapisz zmiany" : "Utwórz zamówienie"}
          onPress={handleOrder}
          loading={isSubmittingOrder}
          containerStyles="mb-8 z-0 h-[56px]"
        />
      </ScrollView>
    </ActionSheet>
  );
}
