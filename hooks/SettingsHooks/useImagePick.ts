import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export default async function useImagePick() {
  let result: ImagePicker.ImagePickerResult | DocumentPicker.DocumentPickerResult;

  if (Platform.OS === "web") {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });
  } else {
    result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      multiple: false,
    });
  }

  return result;
}
