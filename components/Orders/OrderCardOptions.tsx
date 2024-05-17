import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useModalContext } from "@/hooks/useModalContext";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { pl } from "date-fns/locale/pl";
import OrderCardMenuOptions from "./OrderCardMenuOptions";
import OrderCardUserAvatar from "./OrderCardUserAvatar";
import type { Order } from "@/types/orders";

export default function OrderCardOptions({ order }: { order: Order }) {
  const { user } = useGlobalContext();
  const { setEditedOrder, deleteOrder } = useOrdersContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const { setModalData, showModal } = useModalContext();

  const [modalInputValue, setModalInputValue] = useState(order.currentPrice.price.toString() || "");

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Open the bottom sheet with the order data to edit
  const openEditOrderBottomSheet = useCallback(
    (orderCreatorId: Order["user"]["$id"]) => {
      if (user && (user.$id === orderCreatorId || userHasAccess)) {
        setEditedOrder(order);
        handleOpenBottomSheet();
      }
    },
    [user, order, setEditedOrder, handleOpenBottomSheet]
  );

  // Open the modal with the delete confirmation
  const openDeleteModalConfirmation = useCallback(
    (orderId: Order["$id"], orderCreatorId: Order["user"]["$id"]) => {
      if (user && (user.$id === orderCreatorId || userHasAccess)) {
        setModalData({
          title: "Usuwanie zamówienia",
          subtitle: "Czy na pewno chcesz usunąć zamówienie?",
          btn1: {
            text: "Usuń",
            color: "danger",
            onPress: async () => await deleteOrder(orderId),
          },
          btn2: {
            text: "Anuluj",
            color: "primary",
          },
        });
        showModal();
      }
    },
    [user, deleteOrder, showModal]
  );

  // Open the modal with the input to change the order price
  const openChangePriceModal = useCallback(
    (order: Order) => {
      if (user && userHasAccess) {
        setEditedOrder(order);
        setModalData({
          title: "Edycja ceny",
          subtitle: "Wprowadź nową cenę dla zamówienia.",
          btn1: {
            text: "Anuluj",
          },
          btn2: {
            text: "Zapisz",
            color: "primary",
          },
          input: {
            maxLength: 4,
            keyboardType: "number-pad",
            defaultValue: modalInputValue,
            onChangeText: (text) => setModalInputValue(text),
          },
        });
        showModal();
      }
    },
    [setModalData, showModal, setEditedOrder, modalInputValue, setModalInputValue]
  );

  const orderOptions = [
    { text: "Edytuj", onSelect: () => openEditOrderBottomSheet(order.user.$id) },
    { text: "Usuń", onSelect: () => openDeleteModalConfirmation(order.$id, order.user.$id) },
  ];

  // If the user is admin or moderator, add the option to change the price
  if (userHasAccess) {
    orderOptions.push({
      text: "Zmień cenę",
      onSelect: () => openChangePriceModal(order),
    });
  }

  return (
    <View className="flex flex-row-reverse justify-between items-end">
      {((userHasAccess && order.completed) || !order.completed) && ( // Show options only when order is not completed or if order is completed but the user has access
        <OrderCardMenuOptions options={orderOptions} />
      )}

      <View className="mt-8">
        {userHasAccess && (
          <OrderCardUserAvatar
            source={{ uri: order.user.avatar }}
            username={order.user.username}
          />
        )}
        <Text className="font-poppinsLight text-xs">
          {formatDistanceToNow(order.$createdAt, {
            addSuffix: true,
            locale: pl,
          })}
        </Text>
      </View>
    </View>
  );
}
