import { Client, Databases, Account, Avatars } from "react-native-appwrite";
import { parsedEnv } from "./zod/env";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_PROJECT_PLATFORM!
      : parsedEnv.EXPO_PUBLIC_PROJECT_PLATFORM,
  projectId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  avatarsCollectionId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_AVATARS_COLLECTION_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_AVATARS_COLLECTION_ID,
  ordersCollectionId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID,
  buyersCollectionId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_BUYERS_COLLECTION_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_BUYERS_COLLECTION_ID,
  currentPriceCollectionId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_CURRENT_PRICE_COLLECTION_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_CURRENT_PRICE_COLLECTION_ID,
  avatarsStorageId:
    process.env.NODE_ENV === "production"
      ? process.env.EXPO_PUBLIC_APPWRITE_AVATARS_STORAGE_ID!
      : parsedEnv.EXPO_PUBLIC_APPWRITE_AVATARS_STORAGE_ID,
};

// Init react-native SDK
export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
