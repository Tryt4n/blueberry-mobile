import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { BuyersSchema } from "@/lib/zod/buyers";
import type { Buyer } from "@/types/buyers";

export async function getAllBuyers() {
  try {
    const buyers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.buyersCollectionId
    );

    return buyers.documents as Buyer[];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createNewBuyer(buyerName: Buyer["buyerName"]) {
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
      }
    );

    return { buyer: buyer as Buyer, error: null };
  } catch (error: any) {
    throw new Error(error);
  }
}
