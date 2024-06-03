import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import { editUserAvatar } from "@/api/appwrite/users";
import { deleteCustomAvatar } from "@/api/appwrite/avatars";
import { avatarImages } from "@/constants/avatars";
import tw from "@/lib/twrnc";
import SettingsChangeAvatarModal from "./SettingsChangeAvatarModal";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

export default function SettingsEditAvatar() {
  const { user, refetchUser, showAlert } = useGlobalContext();
  const { theme, colors } = useThemeContext();
  const { ordersData } = useOrdersContext();
  const { visible: modalVisible, setModalData, showModal, closeModal } = useModalContext();

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);
  const [customAvatarId, setCustomAvatarId] = useState(user?.customAvatar);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openAvatarEditModal() {
    if (!user) return;

    setModalData({
      title: "Zmień swój avatar",
      onDismiss: () => setAvatar(`${user.avatar}`),
      btn1: { text: "Anuluj", color: "default" },
      btn2: { text: "Zmień", color: "primary" },
      children: (
        <SettingsChangeAvatarModal
          avatar={avatar}
          setAvatar={setAvatar}
          setIsCustomAvatar={setIsCustomAvatar}
          setIsCustomAvatarId={setCustomAvatarId}
        />
      ),
    });
    showModal();
  }

  // Change the user's avatar
  const changeUserAvatar = useCallback(async () => {
    // If the user is not fetched or the avatar is empty do nothing
    if (!user || avatar === "") return;

    setIsSubmitting(true);
    try {
      // Edit the user's avatar
      await editUserAvatar(user.$id, avatar, customAvatarId).then(async () => {
        user?.customAvatar && (await deleteCustomAvatar(user.customAvatar)); // Delete the old custom avatar from the appwrite storage
        customAvatarId && setCustomAvatarId(undefined); // Reset the custom avatar id
        refetchUser(); // Refetch the user data
        ordersData?.refetchData(); // Refetch the orders data
        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: "Avatar został zmieniony.",
          topOffset: 50,
          text1Style: { textAlign: "center" },
        });
      });
    } catch (error) {
      showAlert("Błąd", "Nie udało się zaktualizować avatara. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, avatar, customAvatarId]);

  // Set/update the modal data when the user is fetched and the avatar is set
  useEffect(() => {
    if (!user) return;

    setModalData((prevData) => ({
      ...prevData,
      btn2: { ...prevData.btn2, onPress: changeUserAvatar },
      children: (
        <SettingsChangeAvatarModal
          avatar={avatar}
          setAvatar={setAvatar}
          setIsCustomAvatar={setIsCustomAvatar}
          setIsCustomAvatarId={setCustomAvatarId}
        />
      ),
    }));
  }, [avatar]);

  // Call changeUserAvatar function when custom avatar is selected, close the modal and reset the state
  useEffect(() => {
    if (modalVisible && isCustomAvatar) {
      closeModal();
      setIsCustomAvatar(false);
      changeUserAvatar();
    }
  }, [avatar, isCustomAvatar, modalVisible]);

  return (
    <View style={tw`flex-row items-center justify-between gap-4`}>
      <Text style={tw`font-poppinsSemiBold text-[${colors.text}]`}>Avatar</Text>
      <TouchableOpacity
        style={tw`relative w-16 h-16 rounded-full items-center justify-center`}
        onPress={openAvatarEditModal}
      >
        {isSubmitting ? (
          <ActivityIndicator
            size={"small"}
            color={colors.primary}
          />
        ) : (
          <>
            <Image
              source={
                !isNaN(Number(user?.avatar))
                  ? avatarImages[Number(user?.avatar) - 1]
                  : { uri: user?.avatar }
              }
              style={tw`w-full h-full relative rounded-full`}
            />

            <View style={tw`absolute -right-2 -top-2 p-1.5 rounded-full bg-[${colors.primary}]`}>
              <Feather
                name="edit-3"
                size={16}
                color={theme === "light" ? "white" : colors.text}
              />
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
