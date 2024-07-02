import { TextInput } from "react-native";
import tw from "@/lib/twrnc";
import SimplifiedInput from "../SimplifiedInput";
import type { ComponentProps } from "react";

export default function ModalInput({ ...props }: ComponentProps<typeof TextInput>) {
  return (
    <SimplifiedInput
      containerStyles={tw`flex justify-center items-center mt-2`}
      inputStyles="w-32 text-3xl"
      {...props}
    />
  );
}
