import { View, Text, Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useModalContext } from "@/hooks/useModalContext";
import {
  editOrder as editOrderAppwrite,
  changeOrderPrice as changeOrderPriceAppwrite,
} from "@/api/appwrite/orders";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale/pl";
import Checkbox from "../Checkbox";
import OrderCardMenuOptions from "./OrderCardMenuOptions";
import OrderCardUserAvatar from "./OrderCardUserAvatar";
import Toast from "react-native-toast-message";
import type { Order } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrderCardProps = {
  order: Order;
  price: CurrentPrice["price"];
};

export default function OrderCard({ order: orderTest, price }: OrderCardProps) {
  const { user } = useGlobalContext();
  const { setEditedOrder, deleteOrder } = useOrdersContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();
  const { setModalData, showModal } = useModalContext();

  const [order, setOrder] = useState(orderTest);
  const [modalInputValue, setModalInputValue] = useState(order.currentPrice.price.toString() || "");

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Toggle the completed status of the passed order
  const changeCompletedStatus = useCallback(
    async (order: Order) => {
      // If the user is not the creator of the order and doesn't have access, return
      if (user && order.user.$id !== user.$id && !userHasAccess) return;

      try {
        const updatedOrder = {
          userId: order.user.$id,
          buyerId: order.buyer.$id,
          quantity: order.quantity,
          completed: !order.completed,
          additionalInfo: order.additionalInfo,
        };

        // Update the order in the local state for immediate feedback to the user
        setOrder((prevOrder) => ({ ...prevOrder, completed: !prevOrder.completed }));

        // Update the order in the database
        await editOrderAppwrite(order.$id, updatedOrder);

        // Show a success message to the user
        Toast.show({
          type: "success",
          text1: "Zmieniono status zamówienia na",
          text2: `${order.completed === false ? "ukończone" : "nieukończone"}.`,
          text1Style: { textAlign: "left", fontSize: 16 },
          text2Style: { textAlign: "left", fontSize: 16, fontWeight: "bold", color: "black" },
        });
      } catch (error) {
        // Show an alert to the user if the operation failed
        Alert.alert("Błąd", "Nie udało się zaktualizować zamówienia.");
      }
    },
    [order, editOrderAppwrite]
  );

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

  // Change the price of the order
  const changeOrderPrice = useCallback(async () => {
    if (user && userHasAccess) {
      try {
        const errors = await changeOrderPriceAppwrite(
          order.$id,
          order.currentPrice.$id,
          modalInputValue
        );

        // If there are errors, show alert with those errors, reset input value and return
        if (errors) {
          setModalInputValue(order.currentPrice.price.toString());
          return Alert.alert("Nieprawidłowa wartość", errors.join("\n"));
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
        Alert.alert("Błąd", "Nie udało się zmienić ceny zamówienia.");
      }
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
    <>
      {user && (
        <View
          className={`mb-4 p-4 rounded-xl bg-white shadow-md shadow-black${
            order.completed ? " opacity-50" : ""
          }`}
        >
          <View className="items-end">
            <Checkbox
              status={order.completed}
              disabled={order.user.$id !== user.$id && !userHasAccess}
              onPress={() => changeCompletedStatus(order)}
            />
          </View>

          <Text className="text-xl text-center font-poppinsRegular">
            Ilość: <Text className="font-poppinsSemiBold">{order.quantity}kg</Text>
          </Text>

          <Text className="py-2 text-lg font-poppinsRegular">
            Dla: <Text className="font-poppinsSemiBold capitalize">{order.buyer.buyerName}</Text>
          </Text>

          <Text className="pb-2 text-lg font-poppinsRegular">
            Łącznie:&nbsp;
            <Text className="font-poppinsSemiBold">
              {order.currentPrice.price * order.quantity} zł
            </Text>
            {order.currentPrice.price !== price && (
              <Text className="text-sm">&nbsp;(po {order.currentPrice.price} zł)</Text>
            )}
          </Text>

          {order.additionalInfo && (
            <View className="pt-2 pb-4">
              <Text className="font-poppinsMedium text-sm">Informacje dodatkowe:</Text>
              <Text className="font-poppinsRegular text-[16px]">{order.additionalInfo}</Text>
            </View>
          )}

          <View className="flex flex-row-reverse justify-between items-end">
            {((user.role === "admin" || user.role === "moderator") && order.completed) ||
              (!order.completed && <OrderCardMenuOptions options={orderOptions} />)}

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
        </View>
      )}
    </>
  );
}
