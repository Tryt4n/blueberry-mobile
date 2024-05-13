import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Modal as ReactNativePaperModal, Portal } from "react-native-paper";
import { useModalContext } from "@/hooks/useModalContext";
import type { ComponentProps } from "react";

export type ModalProps = {
  title: string;
  subtitle?: string;
  btn1?: ModalButtonType;
  btn2?: ModalButtonType;
  input?: ComponentProps<typeof TextInput>;
};

type ModalButtonType = {
  text?: string;
  color?: ModalButtonColorType;
  onPress?: () => void;
};

type ModalButtonColorType = "danger" | "primary" | "default";

export default function Modal() {
  const { visible, closeModal, modalData } = useModalContext();
  const { title, subtitle, btn1, btn2, input } = modalData;

  return (
    <Portal>
      <ReactNativePaperModal
        visible={visible}
        onDismiss={closeModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 20,
          maxWidth: "80%",
          alignSelf: "center",
        }}
      >
        <Text className="font-poppinsBold text-xl mb-2">{title}</Text>

        {subtitle && <Text className="font-poppinsMedium text-base">{subtitle}</Text>}

        {input && (
          <View className="flex justify-center items-center mt-2">
            <TextInput
              className="w-32 border-b-2 text-center font-poppinsMedium text-3xl"
              cursorColor="rgb(59 130 246)"
              {...input}
            />
          </View>
        )}

        <View className="flex flex-row justify-end mt-4">
          {btn1 && (
            <DialogButton
              btn={btn1}
              closeModalFn={closeModal}
            />
          )}

          {btn2 && (
            <DialogButton
              btn={btn2}
              closeModalFn={closeModal}
            />
          )}
        </View>
      </ReactNativePaperModal>
    </Portal>
  );
}

function DialogButton({ btn, closeModalFn }: { btn: ModalButtonType; closeModalFn: () => void }) {
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
