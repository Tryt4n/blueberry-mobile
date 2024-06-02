import { Platform } from "react-native";
import { appwriteConfig, storage } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { uriToBlob } from "@/helpers/conversion";
import * as ImageManipulator from "expo-image-manipulator";
import type { ImagePickerAsset } from "expo-image-picker";
import type { DocumentPickerAsset } from "expo-document-picker";

export async function uploadCustomAvatar(customAvatar: ImagePickerAsset | DocumentPickerAsset) {
  try {
    let uri = customAvatar.uri;
    let width: number | undefined;
    let height: number | undefined;

    // Get width and height from customAvatar if available
    if ("width" in customAvatar && "height" in customAvatar) {
      width = customAvatar.width;
      height = customAvatar.height;
    }

    // If width and height are unknown (e.g. on Android), get them
    if (!width || !height) {
      const manipulatorResult = await ImageManipulator.manipulateAsync(uri, []);
      width = manipulatorResult.width;
      height = manipulatorResult.height;
    }

    const cropSize = Math.min(width, height); // Crop the image to a square
    const manipulatorResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          // Crop the image to a square
          crop: {
            originX: (width - cropSize) / 2,
            originY: (height - cropSize) / 2,
            width: cropSize,
            height: cropSize,
          },
        },
        {
          resize: { width: 512, height: 512 }, // Resize the image to 512x512
        },
      ],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // Compress the image to 80% quality and save it as JPEG
    );

    let file: File;

    // Convert the image to a Blob and then to a File
    if (Platform.OS === "web") {
      if ("fileName" in customAvatar) {
        file = await uriToBlob(manipulatorResult.uri, customAvatar.fileName!);
      } else {
        throw new Error("Nie udało się przesłać pliku. Brak nazwy pliku.");
      }
    } else {
      const { mimeType, ...rest } = customAvatar;
      file = { type: mimeType!, ...rest, uri: manipulatorResult.uri } as unknown as File; // Add the changed uri to the file object
    }

    // Upload the custom avatar to the appwrite storage
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

export async function deleteCustomAvatar(avatarId: string) {
  try {
    await storage.deleteFile(appwriteConfig.avatarsStorageId, avatarId);
  } catch (error) {
    throw new Error("Nie udało się usunąć pliku.");
  }
}
