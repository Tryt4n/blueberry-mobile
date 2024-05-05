import { appwriteConfig, databases } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import type { CurrentPrice } from "@/types/currentPrice";

export async function getCurrentPrice() {
  try {
    const price = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.currentPriceCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(1), Query.select(["price", "$id"])]
    );

    return price.documents[0] as unknown as CurrentPrice;
  } catch (error: any) {
    throw new Error(error);
  }
}
