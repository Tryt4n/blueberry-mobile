import { View, ScrollView } from "react-native";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import SettingsEditSection from "@/components/Settings/SettingsEditSection";
import SettingsEditAvatar from "@/components/Settings/SettingsEditAvatar";
import SettingsChangeTheme from "@/components/Settings/SettingsChangeTheme";
import Divider from "@/components/Divider";
import type { EditSettingsOptions } from "@/types/editSettingsOptions";

export default function Settings() {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();

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
        </View>
      )}
    </ScrollView>
  );
}
