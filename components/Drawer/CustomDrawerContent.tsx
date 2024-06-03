import { Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { router, usePathname } from "expo-router";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { avatarImages } from "@/constants/avatars";
import tw from "@/lib/twrnc";
import type { ComponentProps } from "react";

export default function CustomDrawerContent(props: ComponentProps<typeof DrawerItemList>) {
  const { user, platform } = useGlobalContext();
  const { colors } = useThemeContext();
  const pathname = usePathname();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView>
        {user && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={tw`mx-auto mb-8 items-center${platform === "web" ? " mt-8" : ""}`}
            disabled={pathname === "/settings"}
            onPress={() => {
              router.push("/settings");
            }}
          >
            <Image
              source={
                !isNaN(Number(user.avatar))
                  ? avatarImages[Number(user.avatar) - 1]
                  : { uri: user.avatar }
              }
              style={tw`w-24 h-24 rounded-full items-center flex justify-center`}
            />
            <Text style={tw`pt-2 text-xl font-poppinsBold text-center text-[${colors.text}]`}>
              {user.username}
            </Text>
          </TouchableOpacity>
        )}

        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}
