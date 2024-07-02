import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useDataFetch } from "@/hooks/useDataFetch";
import { getListOfUsers } from "@/api/appwrite/users";
import UsersDropDownPicker from "@/components/OrderBottomSheet/UsersDropDownPicker";
import type { User } from "@/types/user";

export function useSelectUser() {
  const { user } = useGlobalContext();
  const { ordersSearchParams, setOrdersSearchParams } = useOrdersContext();
  const { showModal, setModalData } = useModalContext();

  const [searchedUserId, setSearchedUserId] = useState<User["$id"] | undefined>();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Fetch the list of users if the user has access
  const fetchedListOfUsers =
    userHasAccess &&
    useDataFetch(getListOfUsers, [], {
      title: "Błąd",
      message: "Nie udało się pobrać klientów. Spróbuj odświeżyć stronę.",
    });

  const openSelectUserModal = useCallback(() => {
    if (!fetchedListOfUsers) {
      setModalData({
        title: "Błąd",
        subtitle: "Nie udało się pobrać listy użytkowników.",
        btn1: {
          text: "Anuluj",
        },
      });
      showModal();
      return;
    }

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

  useEffect(() => {
    // Update the modal data when the list of users is fetched
    if (fetchedListOfUsers) {
      openSelectUserModal();
    }
  }, [fetchedListOfUsers && fetchedListOfUsers.isLoading]);

  // Reset the searchedUserId in the modal
  const saveSearchedUser = useCallback(async () => {
    setOrdersSearchParams((prevState) => ({
      ...prevState,
      userId: searchedUserId,
    }));
  }, [searchedUserId, setOrdersSearchParams]);

  // Update the saveSearchedUser function in the modal when searchedUserId changes
  useEffect(() => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      btn2: {
        ...prevModalData.btn2,
        onPress: saveSearchedUser,
      },
    }));
  }, [searchedUserId, ordersSearchParams.userId]);

  return { fetchedListOfUsers, openSelectUserModal };
}
