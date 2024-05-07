import { View, Text, Alert, Image } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { editOrder as editOrderAppwrite } from "@/api/appwrite/orders";
import { Entypo } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale/pl";
import BouncyCheckbox from "react-native-bouncy-checkbox/build/dist/BouncyCheckbox";
import OrderCardMenuOptions from "./OrderCardMenuOptions";
import type { Order } from "@/types/orders";

type OrderCardProps = {
  order: Order;
  currentPrice: number;
  refetchOrders: () => Promise<void>;
};

export default function OrderCard({ order: orderTest, currentPrice }: OrderCardProps) {
  const { user } = useGlobalContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();

  const [order, setOrder] = useState(orderTest);

  async function changeCompletedStatus(order: Order) {
    try {
      const updatedOrder = {
        userId: order.user.$id,
        buyerId: order.buyer.$id,
        quantity: order.quantity,
        completed: !order.completed,
        additionalInfo: order.additionalInfo,
      };

      setOrder((prevOrder) => ({ ...prevOrder, completed: !prevOrder.completed }));

      await editOrderAppwrite(order.$id, updatedOrder);
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zaktualizować zamówienia.");
    }
  }

  function editOrder(orderId: Order["$id"], orderCreatorId: Order["user"]["$id"]) {
    if (
      user &&
      (user.$id === orderCreatorId || user.role === "admin" || user.role === "moderator")
    ) {
      console.log("edit");
      handleOpenBottomSheet();
    }
  }

  async function deleteOrder(orderId: Order["$id"], orderCreatorId: Order["user"]["$id"]) {
    if (
      user &&
      (user.$id === orderCreatorId || user.role === "admin" || user.role === "moderator")
    ) {
      console.log("delete");
    }
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
            <BouncyCheckbox
              size={50}
              fillColor="rgb(59 130 246)"
              unFillColor="white"
              disableText={true}
              isChecked={order.completed}
              iconComponent={
                <Entypo
                  name="check"
                  size={30}
                  color={order.completed ? "white" : "hsl(0, 0%, 97%)"}
                />
              }
              innerIconStyle={{ borderWidth: order.completed ? 0 : 2 }}
              textStyle={{ fontFamily: "Poppins-Medium" }}
              onPress={
                user.role === "admin" || user.role === "moderator"
                  ? () => changeCompletedStatus(order)
                  : undefined
              }
              disabled={user.role !== "admin" && user.role !== "moderator"}
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
            <Text className="font-poppinsSemiBold">{currentPrice * order.quantity} zł</Text>
          </Text>

          {order.additionalInfo && (
            <View className="pt-2 pb-4">
              <Text className="font-poppinsMedium text-sm">Informacje dodatkowe:</Text>
              <Text className="font-poppinsRegular text-[16px]">{order.additionalInfo}</Text>
            </View>
          )}

          <View className="flex flex-row-reverse justify-between items-end">
            <OrderCardMenuOptions
              options={[
                { text: "Edytuj", onSelect: () => editOrder(order.$id, order.user.$id) },
                { text: "Usuń", onSelect: () => deleteOrder(order.$id, order.user.$id) },
              ]}
            />

            <View className="mt-8">
              {(user.role === "admin" || user.role === "moderator") && (
                <View className="flex gap-y-1">
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-12 h-12 rounded-full"
                  />
                  <Text className="font-poppinsMedium capitalize">{order.user.username}</Text>
                </View>
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
