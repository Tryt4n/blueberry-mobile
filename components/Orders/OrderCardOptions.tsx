import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "@/lib/twrnc";
import { colors } from "@/helpers/colors";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useModalContext } from "@/hooks/useModalContext";
import { changeOrderPrice as changeOrderPriceAppwrite } from "@/api/appwrite/orders";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { pl } from "date-fns/locale/pl";
import OrderCardMenuOptions from "./OrderCardMenuOptions";
import OrderCardUserAvatar from "./OrderCardUserAvatar";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";
import type { FontAwesome } from "@expo/vector-icons";

type OrderCardOptionsProps = {
  order: Order;
  setOrder: (order: Order | ((prevOrder: Order) => Order)) => void;
};

export type OrderOption = {
  text: string;
  icon: { name: Extract<keyof typeof FontAwesome.glyphMap, string>; color: keyof typeof colors };
  onSelect: () => void;
};

export default function OrderCardOptions({ order, setOrder }: OrderCardOptionsProps) {
  const { user, showAlert } = useGlobalContext();
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

  const orderOptions: OrderOption[] = [
    {
      text: "Edytuj",
      icon: { name: "edit", color: "primary" },
      onSelect: () => openEditOrderBottomSheet(order.user.$id),
    },
    {
      text: "Usuń",
      icon: { name: "trash", color: "danger" },
      onSelect: () => openDeleteModalConfirmation(order.$id, order.user.$id),
    },
  ];

  // If the user is admin or moderator, add the option to change the price
  if (user && userHasAccess) {
    // Change the price of the order
    const changeOrderPrice = useCallback(async () => {
      try {
        const errors = await changeOrderPriceAppwrite(order.$id, modalInputValue);

        // If there are errors, show alert with those errors, reset input value and return
        if (errors) {
          setModalInputValue(order.currentPrice.price.toString());
          return showAlert("Nieprawidłowa wartość", errors.join("\n"));
        }

        // else update the price in the local state and show success message
        setOrder((prevOrder) => ({
          ...prevOrder,
          currentPrice: { ...prevOrder.currentPrice, price: Number(modalInputValue) },
        }));
        Toast.show({
          type: "success",
          text1: `Zmieniono cenę zamówienia na ${modalInputValue} zł`,
          text1Style: { textAlign: "left", fontSize: 16 },
          text2Style: { textAlign: "left", fontSize: 16, fontWeight: "bold", color: "black" },
        });
      } catch (error) {
        // If there was an error, show alert
        return showAlert("Błąd", "Nie udało się zmienić ceny zamówienia.");
      }
    }, [modalInputValue]);

    // Update the onPress function of the confirmation button in the modal data when the input value changes
    useEffect(() => {
      setModalData((prevModalData) => ({
        ...prevModalData,
        btn2: {
          ...prevModalData.btn2,
          onPress: changeOrderPrice,
        },
      }));
    }, [modalInputValue]);

    orderOptions.push({
      text: "Zmień cenę",
      icon: { name: "dollar", color: "primary" },
      onSelect: () => openChangePriceModal(order),
    });
  }

  return (
    <View style={tw`flex flex-row-reverse justify-between items-end`}>
      {((userHasAccess && order.completed) || !order.completed) && ( // Show options only when order is not completed or if order is completed but the user has access
        <OrderCardMenuOptions options={orderOptions} />
      )}

      <View style={tw`mt-8`}>
        {userHasAccess && (
          <OrderCardUserAvatar
            source={{ uri: order.user.avatar }}
            username={order.user.username}
          />
        )}
        <Text style={tw`font-poppinsLight text-xs`}>
          {formatDistanceToNow(order.$createdAt, {
            addSuffix: true,
            locale: pl,
          })}
        </Text>
      </View>
    </View>
  );
}
