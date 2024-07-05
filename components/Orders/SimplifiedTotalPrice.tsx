import { View, Text } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import type { Order } from "@/types/orders";

type SimplifiedTotalPriceProps = {
  order: Order | undefined;
  price: number | null;
  totalPrice: string | number;
};

export default function SimplifiedTotalPrice({
  order,
  price,
  totalPrice,
}: SimplifiedTotalPriceProps) {
  const { colors } = useThemeContext();

  return (
    <View style={tw`flex-row items-baseline`}>
      <Text style={tw`font-poppinsLight text-sm text-[${colors.text}]`}>Łącznie:&nbsp;</Text>

      {order?.currentPrice.price === 0 ? (
        <Text style={tw`text-[${colors.text}] font-poppinsSemiBold`}>Gratis</Text>
      ) : (
        <>
          <Text style={tw`text-base text-[${colors.text}] font-poppinsSemiBold`}>
            {totalPrice} zł
          </Text>

          {order?.currentPrice.price !== price && (
            <Text style={tw`text-[${colors.text}] text-sm`}>
              &nbsp;(po {order?.currentPrice.price} zł)
            </Text>
          )}
        </>
      )}
    </View>
  );
}
