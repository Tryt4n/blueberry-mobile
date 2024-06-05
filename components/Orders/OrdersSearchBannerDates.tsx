import { View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import { formatDate } from "@/helpers/dates";
import tw from "@/lib/twrnc";
import { DateInput } from "../DateInput";
import type { OrdersSearchParams } from "@/types/orders";

export default function OrdersSearchBannerDates() {
  const { ordersSearchParams, setOrdersSearchParams } = useOrdersContext();
  const { colors } = useThemeContext();
  const { showModal, setModalData } = useModalContext();

  const [startDate, setStartDate] = useState<OrdersSearchParams["startDate"]>(
    ordersSearchParams.startDate
  );
  const [endDate, setEndDate] = useState<OrdersSearchParams["endDate"]>(ordersSearchParams.endDate);

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
            [startDate]: {
              selected: true,
              selectedColor: colors.primary,
              marked: endDate === startDate,
            },
            [endDate]: {
              selected: true,
              selectedColor: colors.primary,
              marked: endDate === startDate,
            },
          },
          minDate: period === "start" ? "2024-05-01" : startDate,
        },
      });
      showModal();
    },
    [startDate, endDate, ordersSearchParams, setModalData, showModal]
  );

  // Reset the startDate or endDate in the modal
  function clearModalDates(period: "start" | "end") {
    if (period === "start") {
      setStartDate(ordersSearchParams.startDate);
    } else {
      setEndDate(ordersSearchParams.endDate);
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
          [startDate]: {
            selected: true,
            selectedColor: colors.primary,
            marked: endDate === startDate,
          },
          [endDate]: {
            selected: true,
            selectedColor: colors.primary,
            marked: endDate === startDate,
          },
        },
      },
    }));
  }, [startDate, endDate]);

  return (
    <View style={tw`flex flex-row justify-between mt-4 gap-x-2`}>
      <DateInput
        label="Od:"
        text={
          ordersSearchParams.startDate
            ? formatDate(ordersSearchParams.startDate, "dd-MM-yyyy")
            : "Początek"
        }
        onPress={() => openSelectDateModal("start")}
      />

      <DateInput
        label="Do:"
        text={
          ordersSearchParams.endDate
            ? formatDate(ordersSearchParams.endDate, "dd-MM-yyyy")
            : "Koniec"
        }
        onPress={() => openSelectDateModal("end")}
      />
    </View>
  );
}
