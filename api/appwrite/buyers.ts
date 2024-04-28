import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
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
  try {
    const buyer = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.buyersCollectionId,
      ID.unique(),
      {
        buyerName: buyerName,
        orders: [],
      }
    );

    return buyer as Buyer;
  } catch (error: any) {
    throw new Error(error);
  }
}
