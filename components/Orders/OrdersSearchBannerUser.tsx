import { View, Text, TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useSelectUser } from "@/hooks/OrderHooks/useSelectUser";
import tw from "@/lib/twrnc";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function OrdersSearchBannerUser() {
  const { colors } = useThemeContext();
  const { ordersSearchParams, setOrdersSearchParams } = useOrdersContext();
  const { fetchedListOfUsers, openSelectUserModal } = useSelectUser();

  return (
    <>
      <TouchableOpacity
        onPress={openSelectUserModal}
        style={tw`mt-6 p-2 self-end${
          ordersSearchParams.userId ? "" : ` border-2 rounded-full border-[${colors.primary}]`
        }`}
      >
        <Entypo
          name={ordersSearchParams.userId ? "user" : "add-user"}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>

      {ordersSearchParams.userId && fetchedListOfUsers && fetchedListOfUsers.data && (
        <>
          <Text style={tw`font-poppinsRegular text-[${colors.text}]`}>
            Wyszukiwany użytkownik:&nbsp;
          </Text>

          <View style={tw`mt-2 flex flex-row items-center gap-x-2`}>
            <Text style={tw`font-poppinsMedium text-[${colors.text}]`}>
              {
                fetchedListOfUsers.data.find((user) => user.$id === ordersSearchParams.userId)
                  ?.username
              }
            </Text>
            <TouchableOpacity
              onPress={() =>
                setOrdersSearchParams((prevState) => ({ ...prevState, userId: undefined }))
              }
            >
              <Ionicons
                name="close-outline"
                color={colors.danger}
                size={26}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}
