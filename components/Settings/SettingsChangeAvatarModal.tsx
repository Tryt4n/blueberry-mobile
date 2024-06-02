import { View, TouchableOpacity, Platform } from "react-native";
import { useCallback } from "react";
import { getCustomAvatar, uploadCustomAvatar } from "@/api/appwrite/avatars";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { avatarImages } from "@/constants/avatars";
import { colors } from "@/helpers/colors";
import tw from "@/lib/twrnc";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import SettingsAvatarButton from "./SettingsAvatarButton";
import { FontAwesome6 } from "@expo/vector-icons";

type SettingsChangeAvatarModalProps = {
  avatar: string;
  setAvatar: (value: string) => void;
  setIsCustomAvatar: (value: boolean) => void;
  setIsCustomAvatarId: (value: string) => void;
};

export default function SettingsChangeAvatarModal({
  avatar,
  setAvatar,
  setIsCustomAvatar,
  setIsCustomAvatarId,
}: SettingsChangeAvatarModalProps) {
  const { user, showAlert } = useGlobalContext();

  // Open Image Picker
  const pickImage = useCallback(async () => {
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

    // If the user cancels the image picker do nothing
    if (result.canceled) return;

    try {
      const avatarImage = await uploadCustomAvatar(result.assets[0]); // Upload the custom avatar to the appwrite storage
      const customAvatar = await getCustomAvatar(avatarImage.$id); // Get the custom avatar from the appwrite storage
      setIsCustomAvatarId(avatarImage.$id); // Set the custom avatar id to new custom avatar id
      setAvatar(customAvatar.href); // Set the custom avatar as the user's avatar
      setIsCustomAvatar(true); // Set the custom avatar state to true
    } catch (error: any) {
      showAlert("Błąd", error);
    }
  }, [setAvatar, setIsCustomAvatar, setIsCustomAvatarId]);

  return (
    <View style={tw`my-4 flex-row max-w-[700px] flex-wrap justify-center gap-2`}>
      {avatarImages.map((imgAvatar, index) => (
        <SettingsAvatarButton
          key={imgAvatar}
          condition={avatar === (index + 1).toString()}
          imgSrc={imgAvatar}
          onPress={() => setAvatar((index + 1).toString())}
        />
      ))}

      {user && user.avatar && isNaN(Number(user.avatar)) && (
        <SettingsAvatarButton
          condition={avatar === user.avatar}
          imgSrc={{ uri: user.avatar }}
          onPress={() => setAvatar(user.avatar)}
        />
      )}

      <TouchableOpacity
        style={tw`w-16 h-16 border-2 border-primary rounded-full items-center justify-center`}
        onPress={pickImage}
      >
        <FontAwesome6
          name="add"
          size={32}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
