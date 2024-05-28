import { View } from "react-native";
import tw from "@/lib/twrnc";
import SettingsActionButtons from "./SettingsActionButtons";
import type { ComponentProps } from "react";

type SettingsSectionWrapperProps = {
  children: React.ReactNode;
  btnsProps: ComponentProps<typeof SettingsActionButtons>;
};

export default function SettingsEditSectionWrapper({
  children,
  btnsProps,
}: SettingsSectionWrapperProps) {
  return (
    <>
      <View style={tw`flex-1 max-w-[75%]`}>{children}</View>

      <SettingsActionButtons
        actionBtnProps={btnsProps.actionBtnProps}
        cancelBtnProps={btnsProps.cancelBtnProps}
      />
    </>
  );
}
