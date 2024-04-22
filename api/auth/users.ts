import { account, appwriteConfig, avatars, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import type { User } from "@/app/types/user";
import { Alert } from "react-native";
import { router } from "expo-router";

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error("Failed to get current account");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) {
      throw Error("Failed to get current user");
    } else {
      router.replace("/orders");
      return currentUser.documents[0] as User;
    }
  } catch (error: any) {
    // Alert.alert("Error", error.message);
    console.error(error);
    // router.replace("/signIn");
  }
}

export async function createUser(username: string, email: string, password: string) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) throw Error("Failed to create account");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
}