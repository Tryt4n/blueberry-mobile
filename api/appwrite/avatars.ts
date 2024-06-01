import { Platform } from "react-native";
import { appwriteConfig, storage } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { uriToBlob } from "@/helpers/conversion";
import type { ImagePickerAsset } from "expo-image-picker";
import type { DocumentPickerAsset } from "expo-document-picker";

export async function uploadCustomAvatar(customAvatar: ImagePickerAsset | DocumentPickerAsset) {
  try {
    let file: File;

    if (Platform.OS === "web") {
      if ("fileName" in customAvatar) {
        file = await uriToBlob(customAvatar.uri, customAvatar.fileName!);
      } else {
        throw new Error("Nie udało się przesłać pliku. Brak nazwy pliku.");
      }
    } else {
      const { mimeType, ...rest } = customAvatar;
      file = { type: mimeType!, ...rest } as unknown as File;
    }

    const avatarImage = await storage.createFile(
      appwriteConfig.avatarsStorageId,
      ID.unique(),
      file
    );
    return avatarImage;
  } catch (error) {
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
