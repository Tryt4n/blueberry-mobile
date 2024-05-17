import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getListOfUsers } from "@/api/appwrite/users";
import { UsersDropDownPicker } from "./UsersDropDownPicker";
import { Entypo, Ionicons } from "@expo/vector-icons";
import type { User } from "@/types/user";

export default function OrdersSearchBannerUser() {
  const { user } = useGlobalContext();
  const { ordersSearchParams, setOrdersSearchParams } = useOrdersContext();
  const { showModal, setModalData } = useModalContext();

  const [searchedUserId, setSearchedUserId] = useState<User["$id"] | undefined>();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Fetch the list of users if the user has access
  const fetchedListOfUsers =
    userHasAccess &&
    useAppwrite(getListOfUsers, [], {
      title: "Błąd",
      message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
    });

  const openSelectUserModal = useCallback(() => {
    if (!fetchedListOfUsers) return Alert.alert("Błąd", "Nie udało się pobrać listy użytkowników.");

    setModalData({
      title: "Wybierz użytkownika którego chcesz zobaczyć zamówienia",
      btn1: {
        text: "Anuluj",
      },
      btn2: {
        text: "Wybierz",
        color: "primary",
      },
      children: (
        <UsersDropDownPicker
          users={fetchedListOfUsers.data}
          loading={fetchedListOfUsers.isLoading}
          defaultValue={ordersSearchParams.userId}
          onChangeValue={(value: string | null) => {
            if (!value || !userHasAccess) return;
            setSearchedUserId(value);
          }}
        />
      ),
    });
    showModal();
  }, [fetchedListOfUsers, setModalData, showModal, user, userHasAccess]);

  // Reset the searchedUserId in the modal
  const saveSearchedUser = useCallback(() => {
    setOrdersSearchParams((prevState) => ({
      ...prevState,
      userId: searchedUserId,
    }));
  }, [searchedUserId, setOrdersSearchParams]);

  // Update the saveSearchedUser function in the modal when searchedUserId changes
  useEffect(() => {
    if (!fetchedListOfUsers) return;

    setModalData((prevModalData) => ({
      ...prevModalData,
      btn2: {
        ...prevModalData.btn2,
        onPress: saveSearchedUser,
      },
    }));
  }, [searchedUserId, ordersSearchParams.userId]);

  return (
    <>
      <TouchableOpacity
        onPress={openSelectUserModal}
        className={`mt-6 p-2 self-end${
          ordersSearchParams.userId ? "" : " border-2 rounded-full border-blue-500"
        }`}
      >
        <Entypo
          name={ordersSearchParams.userId ? "user" : "add-user"}
          size={24}
          color="rgb(59 130 246)"
        />
      </TouchableOpacity>

      {ordersSearchParams.userId && fetchedListOfUsers && fetchedListOfUsers.data && (
        <>
          <Text>Wyszukiwany użytkownik:&nbsp;</Text>

          <View className="mt-2 flex flex-row items-center gap-x-2">
            <Text className="font-poppinsMedium">
              {
                fetchedListOfUsers.data.find((user) => user.$id === ordersSearchParams.userId)
                  ?.username
              }
            </Text>
            <TouchableOpacity
              onPress={() =>
                setOrdersSearchParams((prevState) => ({ ...prevState, userId: undefined }))
              }
            >
              <Ionicons
                name="close-outline"
                color="#FF3333"
                size={26}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}
