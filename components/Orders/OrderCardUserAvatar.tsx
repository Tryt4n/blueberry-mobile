import { View, Text, Image, type ImageSourcePropType } from "react-native";
import tw from "@/lib/twrnc";
import type { Order } from "@/types/orders";

type OrderCardUserAvatarProps = {
  source: ImageSourcePropType;
  username: Order["user"]["username"];
};

export default function OrderCardUserAvatar({ source, username }: OrderCardUserAvatarProps) {
  return (
    <View style={tw`gap-y-1 flex-shrink items-start`}>
      <View style={tw`flex items-center`}>
        <Image
          source={source}
          style={tw`w-12 h-12 rounded-full`}
        />
        <Text style={tw`mt-1 font-poppinsMedium capitalize`}>{username}</Text>
      </View>
    </View>
  );
}
