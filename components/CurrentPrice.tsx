import { View, Text } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import CustomButton from "./CustomButton";

export default function CurrentPrice() {
  const { user } = useGlobalContext();
  const { currentPrice } = useOrdersContext();

  return (
    <View className="flex-row items-center gap-4 mb-4">
      <Text className="font-poppinsRegular text-base">
        Cena:&nbsp;
        <Text className="font-poppinsMedium text-xl">{`${currentPrice} zł`}</Text>
      </Text>

      {(user?.role === "admin" || user?.role === "moderator") && (
        <CustomButton
          text="Zmień cenę"
          textStyles="text-xs p-3"
        />
      )}
    </View>
  );
}
