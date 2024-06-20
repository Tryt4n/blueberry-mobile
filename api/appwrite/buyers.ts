import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { BuyersSchema } from "@/lib/zod/buyers";
import type { Buyer } from "@/types/buyers";
import type { User } from "@/types/user";

export async function getBuyers(userId?: User["$id"]) {
  try {
    const filters = userId ? [Query.equal("createdBy", userId)] : [];

    const buyers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.buyersCollectionId,
      filters
    );

    return buyers.documents as Buyer[];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createNewBuyer(buyerName: Buyer["buyerName"], userId: User["$id"]) {
  let customError: string[] = [];

  try {
    const results = BuyersSchema.safeParse({ buyerName });

    if (!results.success) {
      results.error.issues.forEach((issue) => {
        customError.push(issue.message);
      });

      return { buyer: null, error: customError };
    }

    const buyer = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.buyersCollectionId,
      ID.unique(),
      {
        buyerName: buyerName,
        orders: [],
        createdBy: userId,
      }
    );

    return { buyer: buyer as Buyer, error: null };
  } catch (error: any) {
    throw new Error(error);
  }
}
