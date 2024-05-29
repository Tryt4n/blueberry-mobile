import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import { editUserAvatar } from "@/api/appwrite/users";
import { avatarImages } from "@/constants/avatars";
import tw from "@/lib/twrnc";
import SettingsChangeAvatarModal from "./SettingsChangeAvatarModal";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

export default function SettingsEditAvatar() {
  const { user, refetchUser, showAlert } = useGlobalContext();
  const { ordersData } = useOrdersContext();
  const { visible: modalVisible, setModalData, showModal, closeModal } = useModalContext();

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);

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
        />
      ),
    });
    showModal();
  }

  function changeUserAvatar() {
    if (!user || avatar === "") return;

    try {
      editUserAvatar(user.$id, avatar).then(() => {
        refetchUser();
        ordersData?.refetchData();
        Toast.show({
          type: "success",
          text1: "Avatar został zmieniony.",
          topOffset: 50,
          text1Style: { textAlign: "center", fontSize: 16 },
        });
      });
    } catch (error) {
      showAlert("Błąd", "Nie udało się zaktualizować avatara. Spróbuj ponownie.");
    }
  }

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
  }, [avatar]);

  return (
    <View style={tw`flex-row items-center justify-between gap-4`}>
      <Text style={tw`font-poppinsSemiBold`}>Avatar</Text>
      <TouchableOpacity
        style={tw`relative`}
        onPress={openAvatarEditModal}
      >
        <Image
          source={
            !isNaN(Number(user?.avatar))
              ? avatarImages[Number(user?.avatar) - 1]
              : { uri: user?.avatar }
          }
          style={tw`w-16 h-16 relative rounded-full before:`}
        />

        <View style={tw`absolute -right-2 -top-2 p-1.5 rounded-full bg-primary`}>
          <Feather
            name="edit-3"
            size={16}
            color="white"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
