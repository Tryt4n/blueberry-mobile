import { Client, Databases, Account, Avatars } from "react-native-appwrite";
import { parsedEnv } from "./zod/env";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: parsedEnv.EXPO_PUBLIC_PROJECT_PLATFORM,
  projectId: parsedEnv.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: parsedEnv.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: parsedEnv.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  avatarsCollectionId: parsedEnv.EXPO_PUBLIC_APPWRITE_AVATARS_COLLECTION_ID,
  ordersCollectionId: parsedEnv.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID,
  avatarsStorageId: parsedEnv.EXPO_PUBLIC_APPWRITE_AVATARS_STORAGE_ID,
};

// Init react-native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
