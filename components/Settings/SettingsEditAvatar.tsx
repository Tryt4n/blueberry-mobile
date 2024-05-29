import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import { editUserAvatar } from "@/api/appwrite/users";
import { avatarImages } from "@/constants/avatars";
import tw from "@/lib/twrnc";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function SettingsEditAvatar() {
  const { user, refetchUser, showAlert } = useGlobalContext();
  const { ordersData } = useOrdersContext();
  const { setModalData, showModal } = useModalContext();
  const [avatar, setAvatar] = useState(user?.customAvatar ? user.customAvatar : user?.avatar || "");

  function openAvatarEditModal() {
    if (!user) return;

    setModalData({
      title: "Zmień swój avatar",
      onDismiss: () => setAvatar(`${user.customAvatar ? user.customAvatar : user.avatar}`),
      btn1: { text: "Anuluj", color: "default" },
      btn2: { text: "Zmień", color: "primary" },
      children: (
        <View style={tw`my-4 flex-row max-w-[700px] flex-wrap justify-center gap-2`}>
          {avatarImages.map((imgAvatar, index) => (
            <TouchableOpacity
              key={imgAvatar}
              style={tw`${avatar === (index + 1).toString() ? "opacity-25" : ""}`}
              disabled={avatar === (index + 1).toString()}
              onPress={() => setAvatar((index + 1).toString())}
            >
              <Image
                style={tw`w-16 h-16 rounded-full`}
                source={imgAvatar}
              />
            </TouchableOpacity>
          ))}
        </View>
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
        <View style={tw`my-4 flex-row max-w-[700px] flex-wrap justify-center gap-2`}>
          {avatarImages.map((imgAvatar, index) => (
            <TouchableOpacity
              key={imgAvatar}
              style={tw`${avatar === (index + 1).toString() ? "opacity-25" : ""}`}
              disabled={avatar === (index + 1).toString()}
              onPress={() => setAvatar((index + 1).toString())}
            >
              <Image
                style={tw`w-16 h-16 rounded-full`}
                source={imgAvatar}
              />
            </TouchableOpacity>
          ))}
        </View>
      ),
    }));
  }, [avatar]);

  // TODO: Add custom avatar upload (edit function thats create a new account with initials avatar as custom avatar)

  return (
    <View style={tw`flex-row items-center justify-between gap-4`}>
      <Text style={tw`font-poppinsSemiBold`}>Avatar</Text>
      <TouchableOpacity
        style={tw`relative`}
        onPress={openAvatarEditModal}
      >
        <Image
          source={
            user?.avatar
              ? !isNaN(Number(user.avatar))
                ? avatarImages[Number(user.avatar) - 1]
                : { uri: user.avatar }
              : { uri: user?.customAvatar }
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