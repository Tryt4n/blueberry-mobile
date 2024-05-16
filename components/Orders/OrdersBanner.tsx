import { View, Text, Dimensions, Alert } from "react-native";
import { Banner, type BannerProps } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getListOfUsers } from "@/api/appwrite/users";
import { DateInput } from "../DateInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { UsersDropDownPicker } from "./UsersDropDownPicker";
import Toast from "react-native-toast-message";
import type { ValueType } from "react-native-dropdown-picker";
import type { User } from "@/types/user";

export default function OrdersBanner() {
  const { user } = useGlobalContext();
  const {
    isBannerVisible,
    setIsBannerVisible,
    ordersSearchParams,
    setOrdersSearchParams,
    ordersData,
  } = useOrdersContext();
  const { showModal, setModalData } = useModalContext();

  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [searchedUserId, setSearchedUserId] = useState<User["$id"] | undefined>();

  const { width } = Dimensions.get("window");
  const containerWidth = width * 0.9 - 32;
  const inputWidth = (containerWidth - 16) / 2;

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";
  const todayDate = new Date();

  const openSelectDateModal = useCallback(
    (period: "start" | "end") => {
      setModalData({
        title: `Wybierz datę ${period === "start" ? "początkową" : "końcową"}`,
        onDismiss: () => clearModalDates(period),
        btn1: {
          text: "Anuluj",
          onPress: () => clearModalDates(period),
        },
        btn2: {
          text: "Zapisz",
          color: "primary",
        },
        calendar: {
          onDayPress: (day) => {
            period === "start" ? setStartDate(day.dateString) : setEndDate(day.dateString);
          },
          markedDates: {
            [startDate || ordersSearchParams.startDate || ""]: {
              selected: true,
              selectedColor: "rgb(59 130 246)",
            },
            [endDate || ordersSearchParams.endDate || ""]: {
              selected: true,
              selectedColor: "rgb(59 130 246)",
            },
          },
          minDate: period === "start" ? undefined : startDate,
          maxDate: period === "start" && endDate ? endDate : todayDate.toISOString().split("T")[0], // today for end date and endDate for start date if it exists or today if not
        },
      });
      showModal();
    },
    [startDate, endDate, ordersSearchParams, setModalData, showModal]
  );

  // Reset the startDate or endDate in the modal
  function clearModalDates(period: "start" | "end") {
    if (period === "start") {
      setStartDate(undefined);
    } else {
      setEndDate(undefined);
    }
  }

  // Save the selected date range
  const saveDateRange = useCallback(() => {
    setOrdersSearchParams((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));
  }, [startDate, endDate, setOrdersSearchParams]);

  // Update the saveDateRange function in the modal when startDate or endDate changes
  useEffect(() => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      btn2: {
        ...prevModalData.btn2,
        onPress: saveDateRange,
      },
      calendar: {
        ...prevModalData.calendar,
        markedDates: {
          [startDate || ordersSearchParams.startDate || ""]: {
            selected: true,
            selectedColor: "rgb(59 130 246)",
          },
          [endDate || ordersSearchParams.endDate || ""]: {
            selected: true,
            selectedColor: "rgb(59 130 246)",
          },
        },
      },
    }));
  }, [startDate, endDate]);

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
          onChangeValue={(value: ValueType | null) => {
            if (!value || !userHasAccess) return;
            setSearchedUserId(value as string);
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
      children: (
        <UsersDropDownPicker
          users={fetchedListOfUsers.data}
          loading={fetchedListOfUsers.isLoading}
          defaultValue={ordersSearchParams.userId}
        />
      ),
    }));
  }, [searchedUserId, ordersSearchParams.userId]);

  // Fetch new orders based on the selected date range
  const getNewOrders = useCallback(() => {
    if (!ordersSearchParams.startDate && !ordersSearchParams.endDate) {
      return Alert.alert("Błąd", "Wybierz zakres dat przed wyszukaniem.");
    }
    if (!ordersSearchParams.startDate) {
      return Alert.alert("Błąd", "Wybierz datę początkową.");
    }
    if (!ordersSearchParams.endDate) {
      return Alert.alert("Błąd", "Wybierz datę końcową.");
    }

    if (ordersData?.isLoading) return;

    if (ordersData) {
      // Refetch the data with the new parameters
      ordersData.refetchData();

      // Reset values
      setIsBannerVisible(false);
      setStartDate(undefined);
      setEndDate(undefined);
      setSearchedUserId(undefined);

      // Show a success message
      Toast.show({
        type: "info",
        text1: "Zamówienia zostały zaktualizowane",
        text2: "o wybrane parametry.",
        text1Style: { textAlign: "left", fontSize: 16 },
        text2Style: { textAlign: "left", fontSize: 14 },
      });
    }
  }, [ordersSearchParams, ordersData, setIsBannerVisible, setStartDate, setEndDate]);

  // Actions for the <Banner /> component
  const bannerActions: BannerProps["actions"] = [
    {
      label: "Schowaj",
      onPress: () => setIsBannerVisible(false),
      labelStyle: { color: "black", fontFamily: "Poppins-SemiBold", fontSize: 16 },
    },
    {
      label: "Wyszukaj",
      onPress: getNewOrders,
      labelStyle: { color: "rgb(59 130 246)", fontFamily: "Poppins-SemiBold", fontSize: 16 },
    },
  ];

  return (
    <Banner
      visible={isBannerVisible}
      actions={bannerActions}
      elevation={3}
      style={{
        borderRadius: 16,
        backgroundColor: "white",
      }}
      className="my-4"
    >
      <Text
        style={{ fontSize: 24 }}
        className="font-poppinsBold"
      >
        Wyszukaj zamówienia
      </Text>
      <View style={{ width: containerWidth }}>
        <View className="flex flex-row justify-between">
          <DateInput
            containerProps={{ style: { width: inputWidth } }}
            label="Od:"
            text={ordersSearchParams.startDate || "Początek"}
            onPress={() => openSelectDateModal("start")}
          />

          <DateInput
            containerProps={{ style: { width: inputWidth } }}
            label="Do:"
            text={ordersSearchParams.endDate || "Koniec"}
            onPress={() => openSelectDateModal("end")}
          />
        </View>

        {userHasAccess && (
          <TouchableOpacity
            onPress={openSelectUserModal}
            className={`mt-6 p-2 self-end${
              searchedUserId ? "" : " border-2 rounded-full border-blue-500"
            }`}
          >
            <Entypo
              name={searchedUserId ? "user" : "add-user"}
              size={24}
              color="rgb(59 130 246)"
            />
          </TouchableOpacity>
        )}
      </View>
    </Banner>
  );
}
