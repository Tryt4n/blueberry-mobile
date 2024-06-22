import { appwriteConfig, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { CurrentPriceSchema } from "@/lib/zod/currentPrice";
import type { CurrentPrice } from "@/types/currentPrice";

export async function getCurrentPrice() {
  try {
    const price = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.currentPriceCollectionId,
      [
        Query.equal("active", true),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
        Query.select(["price", "$id", "active"]),
      ]
    );

    return price.documents[0] as unknown as CurrentPrice;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updatePrice(price: string, oldPriceId: CurrentPrice["$id"]) {
  try {
    const { errors, updatedPrice } = await getOrCreatePrice(price);

    if (!errors) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.currentPriceCollectionId,
        oldPriceId,
        {
          active: false,
        }
      );
    }

    return { updatedPrice, errors: errors };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getOrCreatePrice(price: string, changePriceToCurrentPrice: boolean = true) {
  const customErrors: string[] = [];
  const formattedPrice = Number(price.toString().replace(",", "."));

  try {
    let updatedPrice: CurrentPrice;
    const results = CurrentPriceSchema.safeParse({ price: formattedPrice });

    if (!results.success) {
      results.error.issues.forEach((issue) => {
        customErrors.push(issue.message);
      });

      return { updatedPrice: null, errors: customErrors };
    }

    const isPriceAlreadyExists = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.currentPriceCollectionId,
      [Query.equal("price", formattedPrice)]
    );

    if (isPriceAlreadyExists.documents.length > 0) {
      const fetchedPrice = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.currentPriceCollectionId,
        isPriceAlreadyExists.documents[0].$id,
        {
          active: changePriceToCurrentPrice,
        }
      );
      updatedPrice = { $id: fetchedPrice.$id, price: fetchedPrice.price };
    } else {
      const fetchedPrice = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.currentPriceCollectionId,
        ID.unique(),
        {
          price: formattedPrice,
          active: changePriceToCurrentPrice,
        }
      );
      updatedPrice = { $id: fetchedPrice.$id, price: fetchedPrice.price };
    }

    return { updatedPrice, errors: null };
  } catch (error: any) {
    throw new Error(error);
  }
}
