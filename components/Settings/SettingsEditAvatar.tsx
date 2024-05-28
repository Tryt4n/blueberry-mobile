import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useModalContext } from "@/hooks/useModalContext";
import { editUserAvatar } from "@/api/appwrite/users";
import tw from "@/lib/twrnc";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function SettingsEditAvatar() {
  const { user, refetchUser, showAlert } = useGlobalContext();
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
          {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
            <TouchableOpacity
              key={num}
              style={tw`${avatar === `./assets/avatars/${num}.png` ? "opacity-25" : ""}`}
              disabled={avatar === `./assets/avatars/${num}.png`}
              onPress={() => setAvatar(`./assets/avatars/${num}.png`)}
            >
              <Image
                style={tw`w-16 h-16 rounded-full`}
                source={{ uri: `./assets/avatars/${num}.png` }}
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
          {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
            <TouchableOpacity
              key={num}
              style={tw`${avatar === `./assets/avatars/${num}.png` ? "opacity-25" : ""}`}
              disabled={avatar === `./assets/avatars/${num}.png`}
              onPress={() => setAvatar(`./assets/avatars/${num}.png`)}
            >
              <Image
                style={tw`w-16 h-16 rounded-full`}
                source={{ uri: `./assets/avatars/${num}.png` }}
              />
            </TouchableOpacity>
          ))}
        </View>
      ),
    }));
  }, [avatar]);

  return (
    <View style={tw`flex-row items-center justify-between gap-4`}>
      <Text style={tw`font-poppinsSemiBold`}>Avatar</Text>
      <TouchableOpacity
        style={tw`relative`}
        onPress={openAvatarEditModal}
      >
        <Image
          source={{ uri: user?.customAvatar ? user.customAvatar : user?.avatar }}
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
