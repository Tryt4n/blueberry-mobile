import { Text, TouchableOpacity } from "react-native";

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
        className="font-poppinsMedium text-base px-2"
        style={{
          color:
            btn.color && btn.color === "danger"
              ? "#FF3333"
              : btn.color === "primary"
              ? "rgb(59 130 246)"
              : "black",
        }}
      >
        {btn.text}
      </Text>
    </TouchableOpacity>
  );
}
