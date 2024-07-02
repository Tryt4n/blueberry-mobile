import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useOrder } from "@/hooks/OrderHooks/useOrder";
import { useDeleteOrder } from "@/hooks/OrderHooks/useDeleteOrder";
import tw from "@/lib/twrnc";
import { Picker } from "@react-native-picker/picker";
import SimplifiedInput from "../SimplifiedInput";
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
  const values = ["250g", "500g"] as const;

  const { width } = useGlobalContext();
  const { colors } = useThemeContext();
  const { user } = useGlobalContext();
  const { setEditedOrder, fetchedBuyers, ordersData } = useOrdersContext();
  const { handleOrder, orderData, changeOrderData, isSubmittingOrder } = useOrder();
  const deleteOrder =
    order && type === "edit" ? useDeleteOrder(order.$id, order.user.$id) : undefined;

  const [boxSize, setBoxSize] = useState<(typeof values)[number]>(
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
          disabled={order?.completed}
          onFocus={() => {
            if (!order) return;

            setEditedOrder(order);
          }}
          onChangeText={(e) => {
            setBuyerName(e);
            changeOrderData({ ...orderData, buyerName: e });
          }}
        />

        <View style={tw`flex-row gap-x-2 justify-evenly items-center`}>
          <View style={tw`flex-row gap-x-4 h-9 items-center`}>
            <Picker
              selectedValue={boxSize}
              // @ts-expect-error - Picker component doesn't have a typescript definition for disabled prop but it works
              disabled={order?.completed}
              onFocus={() => {
                if (!order) return;

                setEditedOrder(order);
              }}
              onValueChange={(itemValue) => {
                setBoxSize(itemValue);
                changeOrderData({
                  ...orderData,
                  additionalInfo: itemValue === "500g" ? "" : "Pojemniki 250g",
                  quantity:
                    (quantity ? quantity / (itemValue === "500g" ? 2 : 4) : order?.quantity) || 1,
                });
              }}
              style={tw`w-30 font-poppinsRegular text-[${colors.textAccent}]${
                quantity && quantity < 0.5 ? ` opacity-25` : ""
              } bg-transparent border-0`}
              dropdownIconColor={colors.primary}
            >
              {values.map((value) => (
                <Picker.Item
                  key={value}
                  label={value}
                  value={value}
                  enabled={(quantity && quantity >= 0.5) || undefined}
                  style={tw`${
                    value === boxSize ? `text-[${colors.primary}]` : `text-[${colors.textAccent}]`
                  }`}
                />
              ))}
            </Picker>

            <SimplifiedInput
              containerStyles={tw`w-8`}
              keyboardType="numeric"
              maxLength={2}
              value={quantity === null ? "" : quantity.toString()}
              disabled={order?.completed}
              onFocus={() => {
                if (!order) return;

                setEditedOrder(order);
              }}
              onChangeText={(e) => {
                // Search for a string that contains only digits or is empty
                const isIntegerOrEmpty = /^[0-9]*$/.test(e);
                if (isIntegerOrEmpty) {
                  setQuantity(e === "" ? null : Number(e));
                  changeOrderData({
                    ...orderData,
                    quantity: Number(e) / (boxSize === "500g" ? 2 : 4),
                    additionalInfo: boxSize === "500g" ? "" : "Pojemniki 250g",
                  });
                }
              }}
              onBlur={() => {
                if (quantity === null || quantity < 1) {
                  // Reset the quantity to default order quantity or set it to 1
                  setQuantity((order && order.quantity * (boxSize === "500g" ? 2 : 4)) || 1);
                }
              }}
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
              <View style={tw`flex-row items-baseline`}>
                <Text style={tw`font-poppinsLight text-sm text-[${colors.text}]`}>
                  Łącznie:&nbsp;
                </Text>

                {order?.currentPrice.price === 0 ? (
                  <Text style={tw`text-[${colors.text}] font-poppinsSemiBold`}>Gratis</Text>
                ) : (
                  <>
                    <Text style={tw`text-base text-[${colors.text}] font-poppinsSemiBold`}>
                      {totalPrice} zł
                    </Text>
                    {order?.currentPrice.price !== price && (
                      <Text style={tw`text-[${colors.text}] text-sm`}>
                        &nbsp;(po {order?.currentPrice.price} zł)
                      </Text>
                    )}
                  </>
                )}
              </View>

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
                      onPress={() => {
                        setBuyerName(order?.buyer.buyerName || "");
                        // Check if boxSize was changed from "500g" to "250g" and adjust quantity accordingly
                        const originalBoxSize =
                          order?.additionalInfo === "Pojemniki 250g" ? "250g" : "500g";
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
                      }}
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
