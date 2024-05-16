import { appwriteConfig, databases } from "@/lib/appwrite";
import type { User } from "@/types/user";

export async function getListOfUsers() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );

    return users.documents as User[];
  } catch (error: any) {
    throw new Error(error);
  }
}
