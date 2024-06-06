import { View } from "react-native";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useSelectDate } from "@/hooks/OrderHooks/useSelectDate";
import { formatDate } from "@/helpers/dates";
import tw from "@/lib/twrnc";
import DateInput from "../DateInput";

export default function OrdersSearchBannerDates() {
  const { ordersSearchParams } = useOrdersContext();
  const openSelectDateModal = useSelectDate();

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
