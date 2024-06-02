import { View, ScrollView } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import tw from "@/lib/twrnc";
import { Divider } from "react-native-paper";
import SettingsEditSection from "@/components/Settings/SettingsEditSection";
import SettingsEditAvatar from "@/components/Settings/SettingsEditAvatar";
import SettingsChangeTheme from "@/components/Settings/SettingsChangeTheme";
import type { EditSettingsOptions } from "@/types/editSettingsOptions";

export default function Settings() {
  const { user } = useGlobalContext();

  const [inputVisible, setInputVisible] = useState<EditSettingsOptions | false>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settingsEditSectionProps = {
    inputVisible,
    setInputVisible,
    isSubmitting,
    setIsSubmitting,
  };

  return (
    <ScrollView
      contentContainerStyle={{
        marginVertical: 64,
        width: "100%",
        maxWidth: 700,
        marginHorizontal: "auto",
      }}
    >
      {user && (
        <View style={tw`w-[90%] mx-auto`}>
          <SettingsEditSection
            type="email"
            {...settingsEditSectionProps}
          />

          <Divider style={tw`my-6`} />

          <SettingsEditSection
            type="username"
            {...settingsEditSectionProps}
          />

          {
            // @ts-ignore - secretPassword is not in the User type but it's in the API response
            !user.secretPassword && (
              <>
                <Divider style={tw`my-6`} />

                <SettingsEditSection
                  type="password"
                  {...settingsEditSectionProps}
                />
              </>
            )
          }

          <Divider style={tw`my-6`} />

          <SettingsEditAvatar />

          <Divider style={tw`my-6`} />

          <SettingsChangeTheme />
        </View>
      )}
    </ScrollView>
  );
}
