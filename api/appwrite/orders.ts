import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import type { User } from "@/types/user";
import type { Order } from "@/types/orders";
import type { Buyer } from "@/types/buyers";

export async function getOrders() {
  try {
    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId
    );

    return orders.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createOrder(
  userId: User["$id"],
  buyerId: Buyer["$id"],
  quantity: number,
  additionalInfo?: string
) {
  try {
    const order = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      {
        user: userId,
        quantity: quantity,
        additionalInfo: additionalInfo ? additionalInfo : null,
        buyer: buyerId,
      }
    );

    return order as Order;
  } catch (error: any) {
    throw new Error(error);
  }
}
