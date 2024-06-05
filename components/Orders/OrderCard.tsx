import { View, Text } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { formatDate } from "@/helpers/dates";
import tw from "@/lib/twrnc";
import OrderCardIssuedCheckbox from "./OrderCardIssuedCheckbox";
import OrderCardCompleteCheckbox from "./OrderCardCompleteCheckbox";
import OrderCardOptions from "./OrderCardOptions";
import type { Order } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrderCardProps = {
  order: Order;
  price: CurrentPrice["price"];
  additionalStyles?: string;
};

export default function OrderCard({ order: orderData, price, additionalStyles }: OrderCardProps) {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();
  const { ordersSearchParams } = useOrdersContext();
  const [order, setOrder] = useState(orderData);

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  return (
    <>
      {user && (
        <View
          style={tw`w-full mb-4 p-4 rounded-xl bg-[${colors.bg}] shadow-md shadow-black${
            order.completed ? " opacity-50" : ""
          }${additionalStyles ? ` ${additionalStyles}` : ""}`}
        >
          <View
            style={tw`flex-row ${
              order.completed || !userHasAccess ? "justify-end" : "justify-between"
            }`}
          >
            {userHasAccess && !order.completed && (
              <OrderCardIssuedCheckbox
                order={order}
                setOrder={setOrder}
              />
            )}
            <OrderCardCompleteCheckbox
              order={order}
              setOrder={setOrder}
            />
          </View>

          <Text style={tw`text-xl text-center font-poppinsRegular text-[${colors.text}]`}>
            Ilość: <Text style={tw`font-poppinsSemiBold`}>{order.quantity}kg</Text>
          </Text>

          <Text style={tw`py-2 text-lg font-poppinsRegular text-[${colors.text}]`}>
            Dla: <Text style={tw`font-poppinsSemiBold capitalize`}>{order.buyer.buyerName}</Text>
          </Text>

          <Text style={tw`pb-2 text-lg font-poppinsRegular text-[${colors.text}]`}>
            Łącznie:&nbsp;
            <Text style={tw`font-poppinsSemiBold`}>
              {order.currentPrice.price * order.quantity} zł
            </Text>
            {order.currentPrice.price !== price && (
              <Text style={tw`text-sm`}>&nbsp;(po {order.currentPrice.price} zł)</Text>
            )}
          </Text>

          {ordersSearchParams.startDate !== ordersSearchParams.endDate && (
            <Text style={tw`text-sm font-poppinsRegular text-[${colors.text}]`}>
              Na:&nbsp;
              <Text style={tw`text-base font-poppinsMedium`}>
                {formatDate(order.deliveryDate, "dd.MM.yyyy - EEEE")}
              </Text>
            </Text>
          )}

          {order.additionalInfo && (
            <View style={tw`pt-2 pb-4`}>
              <Text style={tw`font-poppinsMedium text-sm text-[${colors.text}]`}>
                Informacje dodatkowe:
              </Text>
              <Text style={tw`font-poppinsRegular text-[16px] text-[${colors.text}]`}>
                {order.additionalInfo}
              </Text>
            </View>
          )}

          <OrderCardOptions
            order={order}
            setOrder={setOrder}
          />
        </View>
      )}
    </>
  );
}
