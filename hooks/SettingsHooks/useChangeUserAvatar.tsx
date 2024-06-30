import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "../useGlobalContext";
import { useThemeContext } from "../useThemeContext";
import { useModalContext } from "../useModalContext";
import { editUserAvatar } from "@/api/appwrite/users";
import { deleteCustomAvatar } from "@/api/appwrite/avatars";
import SettingsChangeAvatarModal from "@/components/Settings/SettingsChangeAvatarModal";
import Toast from "react-native-toast-message";

export function useChangeUserAvatar() {
  const { user, refetchUser, showAlert } = useGlobalContext();
  const { theme } = useThemeContext();
  const { visible: modalVisible, setModalData, showModal, closeModal } = useModalContext();

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);
  const [customAvatarId, setCustomAvatarId] = useState(user?.customAvatar);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAvatarEditModal = useCallback(() => {
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
  }, [avatar]);

  // Change the user's avatar
  const changeUserAvatar = useCallback(async () => {
    // If the user is not fetched or the avatar is empty do nothing
    if (!user || avatar === "") return;

    setIsSubmitting(true);
    try {
      // Edit the user's avatar
      await editUserAvatar(user.$id, avatar, customAvatarId).then(async () => {
        // Delete the old custom avatar from the appwrite storage if it exists
        if (user.customAvatar) {
          await deleteCustomAvatar(user.customAvatar);
        }
        customAvatarId && setCustomAvatarId(undefined); // Reset the custom avatar id
        await refetchUser(); // Refetch the user data
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

  return { editUserAvatar: openAvatarEditModal, isSubmitting };
}
