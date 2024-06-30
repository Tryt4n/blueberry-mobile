import { View, ScrollView } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import tw from "@/lib/twrnc";
import SettingsEditSection from "@/components/Settings/SettingsEditSection";
import SettingsEditAvatar from "@/components/Settings/SettingsEditAvatar";
import SettingsChangeTheme from "@/components/Settings/SettingsChangeTheme";
import SettingsSimplifiedView from "@/components/Settings/SettingsSimplifiedView";
import Divider from "@/components/Divider";
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

          <Divider />

          <SettingsEditSection
            type="username"
            {...settingsEditSectionProps}
          />

          {
            // @ts-ignore - secretPassword is not in the User type but it's in the API response
            !user.secretPassword && (
              <>
                <Divider />

                <SettingsEditSection
                  type="password"
                  {...settingsEditSectionProps}
                />
              </>
            )
          }

          <Divider />

          <SettingsEditAvatar />

          <Divider />

          <SettingsChangeTheme />

          <Divider />

          <SettingsSimplifiedView />
        </View>
      )}
    </ScrollView>
  );
}
