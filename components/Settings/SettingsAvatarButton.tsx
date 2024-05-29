import { TouchableOpacity, Image } from "react-native";
import tw from "@/lib/twrnc";
import type { ComponentProps } from "react";

type AvatarButtonProps = {
  condition: boolean;
  imgSrc: ComponentProps<typeof Image>["source"];
} & ComponentProps<typeof TouchableOpacity>;

export default function SettingsAvatarButton({ condition, imgSrc, ...props }: AvatarButtonProps) {
  return (
    <TouchableOpacity
      style={tw`${condition ? "opacity-25" : ""}`}
      disabled={condition}
      {...props}
    >
      <Image
        style={tw`w-16 h-16 rounded-full`}
        source={imgSrc}
      />
    </TouchableOpacity>
  );
}
