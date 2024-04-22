import { Client, Databases, Account, Avatars } from "react-native-appwrite";
import { parsedEnv } from "./zod/env";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  // platform: parsedEnv.PROJECT_PLATFORM,
  // projectId: parsedEnv.APPWRITE_PROJECT_ID,
  // databaseId: parsedEnv.APPWRITE_DATABASE_ID,
  // userCollectionId: parsedEnv.APPWRITE_USER_COLLECTION_ID,
  platform: "com.blueberry.pl",
  projectId: "6624d3c55cf0be359a61",
  databaseId: "6624d7a91497998fa917",
  userCollectionId: "6624d7d49d2ea67ec6db",
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
