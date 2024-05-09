import { useModalContext } from "@/hooks/useModalContext";
import { StatusBar } from "expo-status-bar";
import { TextInput, View } from "react-native";
import Dialog from "react-native-dialog";
import type { ComponentProps } from "react";

export type ModalDataType = {
  title: string;
  description?: string;
  btn1: ModalButtonType;
  btn2?: ModalButtonType;
  input?: ComponentProps<typeof TextInput>;
};

type ModalButtonType = {
  text: string;
  readonly type: "confirm" | "cancel";
  color?: ModalButtonColorType;
  onPress?: () => void;
};

type ModalButtonColorType = "danger" | "primary" | "default";

export default function Modal() {
  const { visible, handleCancel, handleConfirmation, modalData, inputValue, setInputValue } =
    useModalContext();

  const { title, description, btn1, btn2, input } = modalData;

  return (
    <>
      <StatusBar backgroundColor={visible ? "black" : undefined} />

      <Dialog.Container
        visible={visible}
        contentStyle={{ borderRadius: 24 }}
        onBackdropPress={handleCancel}
        onRequestClose={handleCancel}
      >
        <Dialog.Title style={{ fontFamily: "Poppins-Bold", color: "black" }}>{title}</Dialog.Title>

        {description && (
          <Dialog.Description style={{ fontFamily: "Poppins-Medium", color: "black" }}>
            {description}
          </Dialog.Description>
        )}

        {input && (
          <View className="flex justify-center items-center">
            <TextInput
              className="w-32 my-4 border-b-2 text-center font-poppinsMedium text-3xl"
              cursorColor="rgb(59 130 246)"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              {...input}
            />
          </View>
        )}

        <DialogButton
          btn={btn1}
          onPress={btn1.type === "confirm" ? handleConfirmation : handleCancel}
        />

        {btn2 && (
          <DialogButton
            btn={btn2}
            onPress={btn2.type === "confirm" ? handleConfirmation : handleCancel}
          />
        )}
      </Dialog.Container>
    </>
  );
}

function DialogButton({ btn, onPress }: { btn: ModalButtonType; onPress: () => void }) {
  return (
    <Dialog.Button
      style={{
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color:
          btn.color && btn.color === "danger"
            ? "#FF3333"
            : btn.color === "primary"
            ? "rgb(59 130 246)"
            : "black",
      }}
      label={btn.text}
      onPress={onPress}
    />
  );
}
