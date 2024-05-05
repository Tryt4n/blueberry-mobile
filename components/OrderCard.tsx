import { View, Text, Alert, Image } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { editOrder as editOrderAppwrite } from "@/api/appwrite/orders";
import { Entypo } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale/pl";
import CustomButton from "./CustomButton";
import BouncyCheckbox from "react-native-bouncy-checkbox/build/dist/BouncyCheckbox";
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
      handleOpenBottomSheet();
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
            Dla: <Text className="font-poppinsSemiBold">{order.buyer.buyerName}</Text>
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

          <View>
            {(user.role === "admin" || user.role === "moderator") && (
              <View className="flex flex-row items-center justify-end gap-2">
                <View className="flex items-center">
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-12 h-12 rounded-full"
                  />
                  <Text className="font-poppinsMedium">{order.user.username}</Text>
                </View>
              </View>
            )}

            <Text className="font-poppinsLight text-xs text-right">
              {formatDistanceToNow(order.$createdAt, {
                addSuffix: true,
                locale: pl,
              })}
            </Text>
          </View>

          {!order.completed && (
            <View className="pt-4 flex-row gap-4">
              <CustomButton
                text="Edytuj"
                containerStyles="flex-1 bg-white border-2 border-blue-500"
                textStyles="text-black"
                onPress={() => editOrder(order.$id, order.user.$id)}
              />
              <CustomButton
                text="Usuń"
                containerStyles="flex-1 bg-white border-2 border-red-500"
                textStyles="text-black"
                onPress={() => deleteOrder(order.$id, order.user.$id)}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
}
