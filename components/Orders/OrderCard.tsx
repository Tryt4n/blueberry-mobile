import { View, Text } from "react-native";
import { memo } from "react";
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

function OrderCard({ order, price, additionalStyles }: OrderCardProps) {
  const { user, height } = useGlobalContext();
  const { colors } = useThemeContext();
  const { ordersSearchParams } = useOrdersContext();

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
            {
              // Display only when the order is not completed and the user has access
              userHasAccess && !order.completed && <OrderCardIssuedCheckbox order={order} />
            }
            {
              // Display only when the order is issued or the user has access
              (userHasAccess || order.issued) && <OrderCardCompleteCheckbox order={order} />
            }
          </View>

          <Text
            style={tw`${
              height > 680 ? "text-xl" : "text-lg"
            } text-center font-poppinsRegular text-[${colors.text}]`}
          >
            Ilość: <Text style={tw`font-poppinsSemiBold`}>{order.quantity}kg</Text>
          </Text>

          <Text
            style={tw`py-2 ${height > 680 ? "text-lg" : "text-base"} font-poppinsRegular text-[${
              colors.text
            }]`}
          >
            Dla: <Text style={tw`font-poppinsSemiBold capitalize`}>{order.buyer.buyerName}</Text>
          </Text>

          <Text
            style={tw`pb-2 ${height > 680 ? "text-lg" : "text-base"} font-poppinsRegular text-[${
              colors.text
            }]`}
          >
            Łącznie:&nbsp;
            {order.currentPrice.price === 0 ? (
              <Text style={tw`font-poppinsSemiBold`}>Gratis</Text>
            ) : (
              <>
                <Text style={tw`font-poppinsSemiBold`}>
                  {order.currentPrice.price * order.quantity} zł
                </Text>
                {order.currentPrice.price !== price && (
                  <Text style={tw`text-sm`}>&nbsp;(po {order.currentPrice.price} zł)</Text>
                )}
              </>
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

          {order.additionalInfo ? (
            <View style={tw`pt-2 pb-4`}>
              <Text style={tw`font-poppinsMedium text-sm text-[${colors.text}]`}>
                Informacje dodatkowe:
              </Text>
              <Text
                style={tw`font-poppinsRegular ${
                  height > 680 ? "text-[16px]" : "text-[14px]"
                } text-[${colors.text}]`}
              >
                {order.additionalInfo}
              </Text>
            </View>
          ) : null}

          <OrderCardOptions order={order} />
        </View>
      )}
    </>
  );
}

export default memo(OrderCard);
