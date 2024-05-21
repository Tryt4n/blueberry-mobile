import { Text, TouchableOpacity } from "react-native";
import tw from "@/lib/twrnc";

type ModalButtonProps = {
  btn: ModalButtonType;
  closeModalFn: () => void;
};

export type ModalButtonType = {
  text?: string;
  color?: ModalButtonColorType;
  onPress?: () => void;
};

type ModalButtonColorType = "danger" | "primary" | "default";

export default function ModalButton({ btn, closeModalFn }: ModalButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        btn.onPress && btn.onPress();
        closeModalFn();
      }}
    >
      <Text
        style={tw`font-poppinsMedium text-base px-2 ${
          btn.color && btn.color === "danger"
            ? "text-danger"
            : btn.color === "primary"
            ? "text-primary"
            : "text-black"
        }`}
      >
        {btn.text}
      </Text>
    </TouchableOpacity>
  );
}
