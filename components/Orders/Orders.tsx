import { View, Text, ActivityIndicator } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import tw from "@/lib/twrnc";
import PageLayout from "@/layout/PageLayout";
import OrdersList from "@/components/Orders/OrdersList";
import OrdersHeader from "@/components/Orders/OrdersHeader";
import OrderBottomSheet from "@/components/OrderBottomSheet/OrderBottomSheet";
import SimplifiedAddOrderSection from "./SimplifiedAddOrderSection";

export default function Orders() {
  const { user, isSimplifiedView } = useGlobalContext();
  const { colors } = useThemeContext();
  const { ordersData } = useOrdersContext();

  return (
    <PageLayout>
      {user && ordersData && (
        <>
          <View style={tw`h-full`}>
            <OrdersHeader />

            {ordersData.isLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={tw`my-8`}
              />
            ) : (
              <>
                {ordersData.data && ordersData.data.length > 0 ? (
                  <OrdersList />
                ) : (
                  <>
                    {isSimplifiedView && <SimplifiedAddOrderSection />}

                    <Text style={tw`text-center font-poppinsRegular text-lg text-[${colors.text}]`}>
                      Brak zamówień
                    </Text>
                  </>
                )}
              </>
            )}
          </View>
        </>
      )}

      <OrderBottomSheet />
    </PageLayout>
  );
}
