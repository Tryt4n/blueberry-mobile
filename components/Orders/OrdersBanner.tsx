import { View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Banner, type BannerProps } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";

export default function OrdersBanner() {
  const { isBannerVisible, setIsBannerVisible, dateRange, setDateRange, ordersData } =
    useOrdersContext();
  const { showModal, setModalData } = useModalContext();

  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const { width } = Dimensions.get("window");
  const containerWidth = width * 0.9 - 32;
  const inputWidth = (containerWidth - 16) / 2;

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
            [startDate || dateRange.startDate || ""]: {
              selected: true,
              selectedColor: "rgb(59 130 246)",
            },
            [endDate || dateRange.endDate || ""]: {
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
    [startDate, endDate, dateRange, setModalData, showModal]
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
    setDateRange({
      startDate: startDate,
      endDate: endDate,
    });
  }, [startDate, endDate, setDateRange]);

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
          [startDate || dateRange.startDate || ""]: {
            selected: true,
            selectedColor: "rgb(59 130 246)",
          },
          [endDate || dateRange.endDate || ""]: {
            selected: true,
            selectedColor: "rgb(59 130 246)",
          },
        },
      },
    }));
  }, [startDate, endDate]);

  // Fetch new orders based on the selected date range
  const getNewOrders = useCallback(() => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return Alert.alert("Błąd", "Wybierz zakres dat przed wyszukaniem.");
    }
    if (!dateRange.startDate) {
      return Alert.alert("Błąd", "Wybierz datę początkową.");
    }
    if (!dateRange.endDate) {
      return Alert.alert("Błąd", "Wybierz datę końcową.");
    }

    if (ordersData?.isLoading) return;

    if (ordersData) {
      ordersData.refetchData();

      setIsBannerVisible(false);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [dateRange, ordersData, setIsBannerVisible, setStartDate, setEndDate]);

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

      <View
        style={{ width: containerWidth }}
        className="flex flex-row justify-between"
      >
        <View
          style={{ width: inputWidth }}
          className="pt-4"
        >
          <Text className="text-base font-medium pb-1">Od:</Text>
          <TouchableOpacity
            className="border-2 border-black-200 p-4 rounded-2xl hover:border-blue-500"
            onPress={() => openSelectDateModal("start")}
          >
            <Text className="font-poppinsMedium text-center">
              {dateRange.startDate ? dateRange.startDate : "Początek"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ width: inputWidth }}
          className="pt-4"
        >
          <Text className="text-base font-medium pb-1">Do:</Text>
          <TouchableOpacity
            className="border-2 border-black-200 p-4 rounded-2xl hover:border-blue-500"
            onPress={() => openSelectDateModal("end")}
          >
            <Text className="font-poppinsMedium text-center">
              {dateRange.endDate ? dateRange.endDate : "Koniec"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Banner>
  );
}
