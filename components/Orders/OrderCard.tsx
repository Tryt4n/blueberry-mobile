import { View, Text } from "react-native";
import { useState } from "react";
import tw from "@/lib/twrnc";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import OrderCardCompleteCheckbox from "./OrderCardCompleteCheckbox";
import OrderCardOptions from "./OrderCardOptions";
import type { Order } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrderCardProps = {
  order: Order;
  price: CurrentPrice["price"];
};

export default function OrderCard({ order: orderData, price }: OrderCardProps) {
  const { user } = useGlobalContext();

  const [order, setOrder] = useState(orderData);

  return (
    <>
      {user && (
        <View
          style={tw`mb-4 p-4 rounded-xl bg-white shadow-md shadow-black${
            order.completed ? " opacity-50" : ""
          }`}
        >
          <OrderCardCompleteCheckbox
            order={order}
            setOrder={setOrder}
          />

          <Text style={tw`text-xl text-center font-poppinsRegular`}>
            Ilość: <Text style={tw`font-poppinsSemiBold`}>{order.quantity}kg</Text>
          </Text>

          <Text style={tw`py-2 text-lg font-poppinsRegular`}>
            Dla: <Text style={tw`font-poppinsSemiBold capitalize`}>{order.buyer.buyerName}</Text>
          </Text>

          <Text style={tw`pb-2 text-lg font-poppinsRegular`}>
            Łącznie:&nbsp;
            <Text style={tw`font-poppinsSemiBold`}>
              {order.currentPrice.price * order.quantity} zł
            </Text>
            {order.currentPrice.price !== price && (
              <Text style={tw`text-sm`}>&nbsp;(po {order.currentPrice.price} zł)</Text>
            )}
          </Text>

          {order.additionalInfo && (
            <View style={tw`pt-2 pb-4`}>
              <Text style={tw`font-poppinsMedium text-sm`}>Informacje dodatkowe:</Text>
              <Text style={tw`font-poppinsRegular text-[16px]`}>{order.additionalInfo}</Text>
            </View>
          )}

          <OrderCardOptions order={order} />
        </View>
      )}
    </>
  );
}
