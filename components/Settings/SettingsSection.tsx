import { View, Text } from "react-native";
import tw from "@/lib/twrnc";
import CustomButton from "../CustomButton";
import type { ComponentProps } from "react";

type SettingsSectionProps = {
  label: string;
  value?: string;
  btnProps: Omit<ComponentProps<typeof CustomButton>, "text"> & {
    onPress: ComponentProps<typeof CustomButton>["onPress"];
  };
};

export default function SettingsSection({ label, value, btnProps }: SettingsSectionProps) {
  return (
    <>
      <View>
        <Text style={tw`font-poppinsSemiBold`}>{label}</Text>
        {value && <Text style={tw`font-poppinsRegular`}>{value}</Text>}
      </View>

      <CustomButton
        text="Edytuj"
        textStyles="text-sm p-3"
        {...btnProps}
      />
    </>
  );
}
