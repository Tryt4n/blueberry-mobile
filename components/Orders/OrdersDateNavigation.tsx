import { View, Text, TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useDayChange } from "@/hooks/OrderHooks/useDayChange";
import { formatDate } from "@/helpers/dates";
import tw from "@/lib/twrnc";
import { Ionicons } from "@expo/vector-icons";

export default function OrdersDateNavigation() {
  const { colors } = useThemeContext();
  const { ordersData, ordersSearchParams, setIsBannerVisible } = useOrdersContext();
  const handleDayChange = useDayChange();

  const formattedDate =
    ordersSearchParams.startDate === ordersSearchParams.endDate
      ? formatDate(ordersSearchParams.startDate, "dd.MM.yyyy - EEEE")
      : `${formatDate(ordersSearchParams.startDate)} - ${formatDate(ordersSearchParams.endDate)}`;

  return (
    <View
      style={tw`max-w-[700px] my-4 items-center px-4 w-full mx-auto flex flex-row justify-between`}
    >
      <TouchableOpacity
        style={tw`p-2 ${ordersData?.isLoading ? "opacity-50" : ""}`}
        disabled={ordersData?.isLoading}
        onPress={() => handleDayChange("prev")}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsBannerVisible(true)}>
        <Text style={tw`font-poppinsBold text-lg text-[${colors.text}] capitalize`}>
          {formattedDate}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={ordersData?.isLoading}
        onPress={() => handleDayChange("next")}
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
