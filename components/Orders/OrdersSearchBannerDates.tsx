import { View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import tw from "@/lib/twrnc";
import { format, parseISO } from "date-fns";
import { DateInput } from "../DateInput";

export default function OrdersSearchBannerDates({ containerWidth }: { containerWidth: number }) {
  const { ordersSearchParams, setOrdersSearchParams } = useOrdersContext();
  const { colors } = useThemeContext();
  const { showModal, setModalData } = useModalContext();

  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

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
            [startDate || ordersSearchParams.startDate || ""]: {
              selected: true,
              selectedColor: colors.primary,
              marked: endDate === startDate,
            },
            [endDate || ordersSearchParams.endDate || ""]: {
              selected: true,
              selectedColor: colors.primary,
              marked: endDate === startDate,
            },
          },
          minDate: period === "start" ? "2024-05-01" : startDate,
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
            selectedColor: colors.primary,
            marked: endDate === startDate,
          },
          [endDate || ordersSearchParams.endDate || ""]: {
            selected: true,
            selectedColor: colors.primary,
            marked: endDate === startDate,
          },
        },
      },
    }));
  }, [startDate, endDate]);

  const formatDate = (date: string) => {
    const parsedDate = parseISO(date);
    return format(parsedDate, "dd-MM-yyyy");
  };

  return (
    <View style={tw`flex flex-row justify-between mt-4`}>
      <DateInput
        containerProps={{ style: { width: inputWidth } }}
        label="Od:"
        text={ordersSearchParams.startDate ? formatDate(ordersSearchParams.startDate) : "Początek"}
        onPress={() => openSelectDateModal("start")}
      />

      <DateInput
        containerProps={{ style: { width: inputWidth } }}
        label="Do:"
        text={ordersSearchParams.endDate ? formatDate(ordersSearchParams.endDate) : "Koniec"}
        onPress={() => openSelectDateModal("end")}
      />
    </View>
  );
}
