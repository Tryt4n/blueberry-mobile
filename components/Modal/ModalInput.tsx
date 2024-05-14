import { View, TextInput } from "react-native";
import type { ComponentProps } from "react";

export default function ModalInput({ ...props }: ComponentProps<typeof TextInput>) {
  return (
    <View className="flex justify-center items-center mt-2">
      <TextInput
        className="w-32 border-b-2 text-center font-poppinsMedium text-3xl"
        cursorColor="rgb(59 130 246)"
        {...props}
      />
    </View>
  );
}
