import { View, Text, TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useDayChange } from "@/hooks/OrderHooks/useDayChange";
import { formatDate } from "@/helpers/dates";
import tw from "@/lib/twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/hooks/useGlobalContext";

export default function OrdersDateNavigation() {
  const { height } = useGlobalContext();
  const { colors } = useThemeContext();
  const { ordersData, ordersSearchParams, setIsBannerVisible } = useOrdersContext();
  const handleDayChange = useDayChange();

  const formattedDate =
    ordersSearchParams.startDate === ordersSearchParams.endDate
      ? formatDate(ordersSearchParams.startDate, "dd.MM.yyyy - EEEE")
      : `${formatDate(ordersSearchParams.startDate)} - ${formatDate(ordersSearchParams.endDate)}`;

  return (
    <View
      style={tw`max-w-[700px] ${
        height > 680 ? "my-4" : "my-1"
      } items-center w-full mx-auto flex flex-row justify-between`}
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
        <Text
          style={tw`font-poppinsBold ${height > 680 ? "text-lg" : "text-base"} text-[${
            colors.text
          }] capitalize`}
        >
          {formattedDate}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={ordersData?.isLoading}
        onPress={() => handleDayChange("next")}
      >
        <Ionicons
          style={tw`p-2 ${ordersData?.isLoading ? "opacity-50" : ""}`}
          name="chevron-forward"
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
