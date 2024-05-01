import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { OrderSchema } from "@/lib/zod/order";
import type { User } from "@/types/user";
import type { Order } from "@/types/orders";
import type { Buyer } from "@/types/buyers";

export async function getOrders(usedId?: User["$id"]) {
  try {
    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      usedId ? [Query.equal("user", usedId)] : undefined
    );

    return orders.documents as Order[];
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
  const customErrors: Record<string, string[]> = {
    userId: [],
    buyerId: [],
    quantity: [],
    additionalInfo: [],
  };

  try {
    const results = OrderSchema.safeParse({ userId, buyerId, quantity, additionalInfo });

    if (!results.success) {
      results.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof customErrors;
        if (field in customErrors) {
          customErrors[field].push(issue.message);
        }
      });

      return { order: null, errors: customErrors };
    } else {
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

      return { order: order as Order, errors: null };
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function editOrder(
  orderId: Order["$id"],
  updatedOrderData: {
    userId: User["$id"];
    buyerId: Buyer["$id"];
    quantity: number;
    completed: boolean;
    additionalInfo: string | null;
  }
) {
  const customErrors: Record<string, string[]> = {
    userId: [],
    buyerId: [],
    quantity: [],
    additionalInfo: [],
  };

  try {
    const results = OrderSchema.safeParse(updatedOrderData);

    if (!results.success) {
      results.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof customErrors;
        if (field in customErrors) {
          customErrors[field].push(issue.message);
        }
      });

      return { order: null, errors: customErrors };
    } else {
      const order = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        orderId,
        {
          user: updatedOrderData.userId,
          buyer: updatedOrderData.buyerId,
          quantity: updatedOrderData.quantity,
          additionalInfo: updatedOrderData.additionalInfo,
          completed: updatedOrderData.completed,
        }
      );

      return { order: order as Order, errors: null };
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
