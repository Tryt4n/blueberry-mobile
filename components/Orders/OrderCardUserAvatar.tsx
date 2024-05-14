import { View, Text, Image, type ImageSourcePropType } from "react-native";
import type { Order } from "@/types/orders";

type OrderCardUserAvatarProps = {
  source: ImageSourcePropType;
  username: Order["user"]["username"];
};

export default function OrderCardUserAvatar({ source, username }: OrderCardUserAvatarProps) {
  return (
    <View className="gap-y-1 flex-shrink items-start">
      <View className="flex items-center">
        <Image
          source={source}
          className="w-12 h-12 rounded-full"
        />
        <Text className="font-poppinsMedium capitalize">{username}</Text>
      </View>
    </View>
  );
}
