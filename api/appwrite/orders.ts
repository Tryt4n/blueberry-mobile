import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { updatePrice } from "./currentPrice";
import { OrderSchema } from "@/lib/zod/order";
import type { User } from "@/types/user";
import type { Order } from "@/types/orders";
import type { Buyer } from "@/types/buyers";
import type { CurrentPrice } from "@/types/currentPrice";

export async function getOrders(userId?: User["$id"]) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString();

    let ordersFilters = [Query.greaterThanEqual("$updatedAt", todayString)];
    let uncompletedOrdersFilters = [Query.equal("completed", false)];
    if (userId) {
      const userFilter = Query.equal("user", userId);
      ordersFilters.push(userFilter);
      uncompletedOrdersFilters.push(userFilter);
    }

    const [orders, uncompletedOrders] = await Promise.all([
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        ordersFilters
      ),
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.ordersCollectionId,
        uncompletedOrdersFilters
      ),
    ]);

    const uncompletedOrdersIds = uncompletedOrders.documents.map((order) => order.$id);
    const combinedOrders = [
      ...uncompletedOrders.documents,
      ...orders.documents.filter((order) => !uncompletedOrdersIds.includes(order.$id)),
    ];

    const combinedAndSortedOrders = combinedOrders.sort((a, b) => {
      const dateA = new Date(a.$createdAt);
      const dateB = new Date(b.$createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return combinedAndSortedOrders as Order[];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createOrder(
  userId: User["$id"],
  buyerId: Buyer["$id"],
  quantity: number,
  currentPriceId: CurrentPrice["$id"],
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
          currentPrice: currentPriceId,
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

export async function changeOrderPrice(
  orderId: Order["$id"],
  oldPriceId: CurrentPrice["$id"],
  newPrice: string
) {
  try {
    const { errors, updatedPrice } = await updatePrice(newPrice, oldPriceId);

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

export async function getOrdersBySearchParams(
  startDate: string,
  endDate: string,
  userId?: User["$id"]
) {
  try {
    // Add time to endDate to include the whole day instead of just the midnight
    endDate = endDate + "T23:59:59.999Z";

    let ordersFilters = [Query.between("$createdAt", startDate, endDate)];

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
