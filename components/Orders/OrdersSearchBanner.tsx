import { View, Text, useWindowDimensions } from "react-native";
import { Banner } from "react-native-paper";
import { useMemo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import tw from "@/lib/twrnc";
import OrdersSearchBannerDates from "./OrdersSearchBannerDates";
import OrdersSearchBannerUser from "./OrdersSearchBannerUser";

export default function OrdersSearchBanner() {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();
  const { isBannerVisible, setIsBannerVisible } = useOrdersContext();
  const { width } = useWindowDimensions();

  const containerWidth = useMemo(() => {
    return width * 0.9 - 32 <= 700 ? width * 0.9 - 32 : 700 - 32;
  }, [width]);

  return (
    <Banner
      visible={isBannerVisible}
      actions={[
        {
          label: "Schowaj",
          onPress: () => setIsBannerVisible(false),
          labelStyle: { color: colors.danger, fontFamily: "Poppins-SemiBold", fontSize: 16 },
        },
      ]}
      elevation={3}
      style={tw`bg-[${colors.bg}] rounded-2xl w-full max-w-[700px] mx-auto${
        isBannerVisible ? " mt-4 my-6" : ""
      }`}
    >
      <Text style={[tw`font-poppinsBold text-[${colors.text}]`, { fontSize: 24 }]}>
        Wyszukaj zamówienia
      </Text>

      <View style={{ width: containerWidth }}>
        <OrdersSearchBannerDates containerWidth={containerWidth} />

        {(user?.role === "admin" || user?.role === "moderator") && <OrdersSearchBannerUser />}
      </View>
    </Banner>
  );
}
