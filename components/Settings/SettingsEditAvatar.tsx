import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useChangeUserAvatar } from "@/hooks/SettingsHooks/useChangeUserAvatar";
import { avatarImages } from "@/constants/avatars";
import tw from "@/lib/twrnc";
import { Feather } from "@expo/vector-icons";

export default function SettingsEditAvatar() {
  const { user } = useGlobalContext();
  const { theme, colors } = useThemeContext();
  const { editUserAvatar, isSubmitting } = useChangeUserAvatar();

  return (
    <View style={tw`flex-row items-center justify-between gap-4`}>
      <Text style={tw`font-poppinsSemiBold text-[${colors.text}]`}>Avatar</Text>
      <TouchableOpacity
        style={tw`relative w-16 h-16 rounded-full items-center justify-center`}
        onPress={editUserAvatar}
      >
        {isSubmitting ? (
          <ActivityIndicator
            size={"small"}
            color={colors.primary}
          />
        ) : (
          <>
            <Image
              source={
                !isNaN(Number(user?.avatar))
                  ? avatarImages[Number(user?.avatar) - 1]
                  : { uri: user?.avatar }
              }
              style={tw`w-full h-full relative rounded-full`}
            />

            <View style={tw`absolute -right-2 -top-2 p-1.5 rounded-full bg-[${colors.primary}]`}>
              <Feather
                name="edit-3"
                size={16}
                color={theme === "light" ? "white" : colors.text}
              />
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
