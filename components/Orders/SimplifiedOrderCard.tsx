import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useOrder } from "@/hooks/OrderHooks/useOrder";
import { useDeleteOrder } from "@/hooks/OrderHooks/useDeleteOrder";
import { boxSizeValues } from "@/constants/orders";
import tw from "@/lib/twrnc";
import SimplifiedInput from "../SimplifiedInput";
import SimplifiedPicker from "./SimplifiedPicker";
import SimplifiedTotalPrice from "./SimplifiedTotalPrice";
import OrderCardCompleteCheckbox from "./OrderCardCompleteCheckbox";
import CustomButton from "../CustomButton";
import Divider from "../Divider";
import type { Order } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type SimplifiedOrderCardProps = {
  type: "new" | "edit";
  order?: Order;
  price: CurrentPrice["price"] | null;
  containerStyles?: string;
};

export default function SimplifiedOrderCard({
  type,
  order,
  price,
  containerStyles,
}: SimplifiedOrderCardProps) {
  const { width } = useGlobalContext();
  const { colors } = useThemeContext();
  const { user } = useGlobalContext();
  const { setEditedOrder, fetchedBuyers, ordersData } = useOrdersContext();
  const { handleOrder, orderData, changeOrderData, isSubmittingOrder } = useOrder();
  const deleteOrder =
    order && type === "edit" ? useDeleteOrder(order.$id, order.user.$id) : undefined;

  const [boxSize, setBoxSize] = useState<(typeof boxSizeValues)[number]>(
    order?.additionalInfo === "Pojemniki 250g" ? "250g" : "500g"
  );
  const [buyerName, setBuyerName] = useState(order?.buyer.buyerName || "");
  const [quantity, setQuantity] = useState<number | null>(
    order ? calculateDisplayValue(order.quantity) : null
  );
  const [totalPrice, setTotalPrice] = useState(
    order ? order.currentPrice.price * order.quantity : ""
  );

  function calculateDisplayValue(value: number) {
    const quantityMultiplier = boxSize === "500g" ? 0.5 : 0.25;
    return value / quantityMultiplier;
  }

  function changeBuyerName(value: string) {
    setBuyerName(value);
    changeOrderData({ ...orderData, buyerName: value });
  }

  function changeBoxSize(value: (typeof boxSizeValues)[number]) {
    setBoxSize(value);
    changeOrderData({
      ...orderData,
      additionalInfo: value === "500g" ? "" : "Pojemniki 250g",
      quantity: (quantity ? quantity / (value === "500g" ? 2 : 4) : order?.quantity) || 1,
    });
  }

  function changeQuantity(value: string) {
    const isIntegerOrEmpty = /^[0-9]*$/.test(value);
    if (isIntegerOrEmpty) {
      setQuantity(value === "" ? null : Number(value));
      changeOrderData({
        ...orderData,
        quantity: Number(value) / (boxSize === "500g" ? 2 : 4),
        additionalInfo: boxSize === "500g" ? "" : "Pojemniki 250g",
      });
    }
  }

  function resetQuantity() {
    if (quantity === null || quantity < 1) {
      // Reset the quantity to default order quantity or set it to 1
      setQuantity((order && order.quantity * (boxSize === "500g" ? 2 : 4)) || 1);
    }
  }

  const onInputFocus = useCallback(() => {
    if (!order) return;
    setEditedOrder(order);
  }, [order]);

  const resetEditedOrder = useCallback(() => {
    setBuyerName(order?.buyer.buyerName || "");
    // Check if boxSize was changed from "500g" to "250g" and adjust quantity accordingly
    const originalBoxSize = order?.additionalInfo === "Pojemniki 250g" ? "250g" : "500g";
    // If the boxSize was changed, adjust the quantity
    if (boxSize !== originalBoxSize) {
      if (!order) return;

      const adjustedQuantity =
        originalBoxSize === "250g"
          ? calculateDisplayValue(order.quantity) * 2 // If the original box size was 250g, multiply the quantity by 2
          : calculateDisplayValue(order.quantity) / 2; // If the original box size was 500g, divide the quantity by 2
      setQuantity(adjustedQuantity);
    } else {
      setQuantity(order ? calculateDisplayValue(order.quantity) : null); // If the boxSize wasn't changed, set the quantity to the original value
    }
    setBoxSize(originalBoxSize);
    setEditedOrder(null);
  }, [order, boxSize]);

  useEffect(() => {
    if (quantity === null) return;

    setTotalPrice(
      order ? order.currentPrice.price * (quantity * (boxSize === "500g" ? 0.5 : 0.25)) : ""
    );
  }, [quantity, boxSize]);

  return (
    <>
      <View
        style={tw`relative${ordersData?.data && ordersData.data.length > 0 ? " flex-1" : ""} ${
          width >= 700 ? "mr-2 " : ""
        } mb-2 p-2 rounded-lg gap-y-2 ${order?.completed ? "opacity-50" : ""} ${
          containerStyles ? ` ${containerStyles}` : ""
        }`}
      >
        <SimplifiedInput
          containerStyles={tw`w-[66%] mx-auto`}
          placeholder="Wprowadź nazwę"
          placeholderTextColor={`${colors.text}20`}
          value={buyerName}
          disabled={order?.completed} // for web only
          editable={!order?.completed} // for mobile (disable only the input editing, not the focus)
          onFocus={onInputFocus}
          onChangeText={changeBuyerName}
        />

        <View style={tw`flex-row gap-x-2 justify-evenly items-center`}>
          <View style={tw`flex-row gap-x-4 h-9 items-center`}>
            <SimplifiedPicker
              boxSize={boxSize}
              quantity={quantity}
              selectedValue={boxSize}
              // @ts-expect-error - Picker component doesn't have a typescript definition for disabled prop but it works for web
              disabled={order?.completed}
              enabled={order?.completed}
              onFocus={onInputFocus}
              onValueChange={changeBoxSize}
            />

            <SimplifiedInput
              containerStyles={tw`w-8`}
              keyboardType="numeric"
              maxLength={2}
              value={quantity === null ? "" : quantity.toString()}
              disabled={order?.completed} // for web only
              editable={!order?.completed} // for mobile (disable only the input editing, not the focus)
              onFocus={onInputFocus}
              onChangeText={changeQuantity}
              onBlur={resetQuantity}
            />
          </View>

          {type === "edit" &&
            order &&
            (user?.role === "admin" || user?.role === "moderator" || order.issued) && (
              <OrderCardCompleteCheckbox order={order} />
            )}

          {type === "new" && (
            <CustomButton
              text="Dodaj"
              containerStyles="w-[70px] h-[36px]"
              textStyles="py-1.5 px-2.5 text-sm"
              disabled={fetchedBuyers?.isLoading || fetchedBuyers?.isLoading}
              loading={isSubmittingOrder || fetchedBuyers?.isLoading}
              loadingSpinnerSize="small"
              onPress={handleOrder}
            />
          )}
        </View>

        {
          // Display the total price
          type === "edit" && (
            <View style={tw`h-9 flex-row items-center justify-between`}>
              <SimplifiedTotalPrice
                order={order}
                price={price}
                totalPrice={totalPrice}
              />

              {
                // Show the cancel and edit buttons
                ((quantity &&
                  order &&
                  calculateDisplayValue(order.quantity) !== quantity &&
                  quantity >= 1) ||
                  order?.buyer.buyerName !== buyerName.toLowerCase() ||
                  (order.additionalInfo === "Pojemniki 250g" ? "250g" : "500g") !== boxSize) && (
                  <View style={tw`flex-row gap-x-2`}>
                    <CustomButton
                      text="Anuluj"
                      containerStyles={`h-[36px] bg-[${colors.danger}]`}
                      textStyles="py-1.5 px-2.5 text-sm"
                      onPress={resetEditedOrder}
                    />

                    <CustomButton
                      text="Edytuj"
                      containerStyles="w-[70px] h-[36px]"
                      textStyles="py-1.5 px-2.5 text-sm"
                      disabled={fetchedBuyers?.isLoading || fetchedBuyers?.isLoading}
                      loading={isSubmittingOrder || fetchedBuyers?.isLoading}
                      loadingSpinnerSize="small"
                      onPress={handleOrder}
                    />
                  </View>
                )
              }
            </View>
          )
        }

        {
          // Delete order button
          type === "edit" && order && (
            <CustomButton
              text="&#x2715;" // Unicode x symbol
              containerStyles={`absolute top-0 right-0 bg-transparent`}
              textStyles={`py-1.5 px-2.5 text-xl text-[${colors.text}]`}
              disabled={order?.completed}
              onPress={deleteOrder}
            />
          )
        }
      </View>

      {type === "new" && <Divider />}
    </>
  );
}
