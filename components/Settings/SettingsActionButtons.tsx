import { View } from "react-native";
import tw from "@/lib/twrnc";
import CustomButton from "../CustomButton";
import type { ComponentProps } from "react";

type SettingsActionButtonsProps = {
  actionBtnProps: Omit<ComponentProps<typeof CustomButton>, "text">;
  cancelBtnProps: Omit<ComponentProps<typeof CustomButton>, "text">;
};

export default function SettingsActionButtons({
  actionBtnProps,
  cancelBtnProps,
}: SettingsActionButtonsProps) {
  return (
    <View style={tw`gap-y-2`}>
      <CustomButton
        text="Zmień"
        textStyles="text-sm p-3"
        loadingSpinnerSize="small"
        {...actionBtnProps}
      />
      <CustomButton
        text="Anuluj"
        containerStyles="bg-danger"
        textStyles="text-sm p-3"
        {...cancelBtnProps}
      />
    </View>
  );
}