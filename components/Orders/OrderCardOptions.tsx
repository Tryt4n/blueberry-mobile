import { View, Text } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useEditOrder } from "./OrderOptions/useEditOrder";
import { useDeleteOrder } from "./OrderOptions/useDeleteOrder";
import { useChangeOrderPrice } from "./OrderOptions/useChangeOrderPrice";
import { useChangeOrderDate } from "./OrderOptions/useChangeOrderDate";
import { avatarImages } from "@/constants/avatars";
import { formatDate } from "@/helpers/dates";
import { isBefore, subDays, formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale/pl";
import tw from "@/lib/twrnc";
import OrderCardMenuOptions from "./OrderCardMenuOptions";
import OrderCardUserAvatar from "./OrderCardUserAvatar";
import type { Order } from "@/types/orders";
import type { FontAwesome } from "@expo/vector-icons";
import type { Colors } from "@/context/ThemeContext";

export type OrderOption = {
  text: string;
  icon: { name: Extract<keyof typeof FontAwesome.glyphMap, string>; color: Colors };
  onSelect: () => void;
};

export default function OrderCardOptions({ order }: { order: Order }) {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();

  const [modalInputValue, setModalInputValue] = useState(order.currentPrice.price.toString() || "");

  const editOrder = useEditOrder(order);
  const deleteOrder = useDeleteOrder(order.$id, order.user.$id);
  const changeOrderDate = useChangeOrderDate(order);

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  const orderOptions: OrderOption[] = [
    {
      text: "Edytuj",
      icon: { name: "edit", color: "primary" },
      onSelect: editOrder,
    },
    {
      text: "Usuń",
      icon: { name: "trash", color: "danger" },
      onSelect: deleteOrder,
    },
    {
      text: "Zmień datę dostawy",
      icon: { name: "calendar", color: "primary" },
      onSelect: changeOrderDate,
    },
  ];

  // If the user is admin or moderator, add the option to change the price
  if (user && userHasAccess) {
    const changeOrderPrice = useChangeOrderPrice(order, modalInputValue, setModalInputValue);

    // Insert the option before the last option
    orderOptions.splice(orderOptions.length - 1, 0, {
      text: "Zmień cenę",
      icon: { name: "dollar", color: "primary" },
      onSelect: changeOrderPrice,
    });
  }

  return (
    <View style={tw`flex flex-row-reverse justify-between items-end`}>
      {
        // Show options only when order is not completed or if order is completed but the user has access
        ((userHasAccess && order.completed) || !order.completed) && (
          <OrderCardMenuOptions options={orderOptions} />
        )
      }

      <View style={tw`mt-8`}>
        {userHasAccess && (
          <OrderCardUserAvatar
            source={
              !isNaN(Number(order.user.avatar))
                ? avatarImages[Number(order.user.avatar) - 1]
                : { uri: order.user.avatar }
            }
            username={order.user.username}
          />
        )}
        <Text style={tw`font-poppinsLight text-xs text-[${colors.text}]`}>
          {isBefore(new Date(order.$createdAt), subDays(new Date(), 1))
            ? formatDate(order.$createdAt, "dd.MM.yyyy")
            : formatDistanceToNow(new Date(order.$createdAt), {
                addSuffix: true,
                locale: pl,
              })}
        </Text>
      </View>
    </View>
  );
}
