import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { getOrCreatePrice } from "./currentPrice";
import { OrderSchema } from "@/lib/zod/order";
import type { User } from "@/types/user";
import type { Order } from "@/types/orders";
import type { Buyer } from "@/types/buyers";
import type { CurrentPrice } from "@/types/currentPrice";

export async function createOrder(
  userId: User["$id"],
  buyerId: Buyer["$id"],
  quantity: Order["quantity"],
  currentPriceId: CurrentPrice["$id"],
  additionalInfo: Order["additionalInfo"],
  deliveryDate: Order["deliveryDate"]
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
          quantity,
          additionalInfo: additionalInfo ? additionalInfo : null,
          buyer: buyerId,
          currentPrice: currentPriceId,
          deliveryDate,
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
    quantity: Order["quantity"];
    completed: Order["completed"];
    additionalInfo: Order["additionalInfo"];
    issued: Order["issued"];
    deliveryDate: Order["deliveryDate"];
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
          issued: updatedOrderData.issued,
          deliveryDate: updatedOrderData.deliveryDate,
        }
      );

      return { order: order as Order, errors: null };
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteOrder(orderId: Order["$id"]) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      orderId
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function changeOrderPrice(orderId: Order["$id"], newPrice: string) {
  try {
    const { errors, updatedPrice } = await getOrCreatePrice(newPrice, false); // false means that the price is not changed to current price but only for the current order

    if (errors) {
      return errors;
    } else {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        orderId,
        {
          currentPrice: updatedPrice.$id,
        }
      );
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getOrders(startDate: string, endDate: string, userId?: User["$id"]) {
  try {
    // Add time to endDate to include the whole day instead of just the midnight
    endDate = endDate + "T23:59:59.999Z";

    let ordersFilters = [
      Query.between("deliveryDate", startDate, endDate),
      Query.orderDesc("$createdAt"),
    ];

    if (userId) {
      ordersFilters.push(Query.equal("user", userId));
    }

    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ordersFilters
    );

    return orders.documents as Order[];
  } catch (error: any) {
    throw new Error(error);
  }
}
