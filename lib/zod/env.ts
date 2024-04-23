import { z } from "zod";
import appConfig from "../../app.json";

const envSchema = z.object({
  EXPO_PUBLIC_PROJECT_PLATFORM: z.string().default(appConfig.expo.android.package),
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: z.string().min(1),
  EXPO_PUBLIC_APPWRITE_DATABASE_ID: z.string().min(1),
  EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID: z.string().min(1),
  EXPO_PUBLIC_APPWRITE_AVATARS_COLLECTION_ID: z.string().min(1),
  EXPO_PUBLIC_APPWRITE_AVATARS_STORAGE_ID: z.string().min(1),
});

export const parsedEnv = envSchema.parse(process.env);
