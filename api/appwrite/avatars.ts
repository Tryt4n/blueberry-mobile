import { appwriteConfig, storage } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { uriToBlob } from "@/helpers/conversion";
import type { ImagePickerAsset } from "expo-image-picker";

export async function uploadCustomAvatar(customAvatar: ImagePickerAsset) {
  try {
    const file = await uriToBlob(customAvatar.uri, customAvatar.fileName!);
    const avatarImage = await storage.createFile(
      appwriteConfig.avatarsStorageId,
      ID.unique(),
      file
    );
    return avatarImage;
  } catch (error) {
    console.log(error);
    throw new Error("Nie udało się przesłać pliku. Spróbuj ponownie.");
  }
}

export async function getCustomAvatar(avatarId: string) {
  try {
    const avatar = storage.getFileView(appwriteConfig.avatarsStorageId, avatarId);

    return avatar;
  } catch (error) {
    throw new Error("Nie udało się pobrać pliku. Spróbuj ponownie.");
  }
}
