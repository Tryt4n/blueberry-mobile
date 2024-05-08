import { useModalContext } from "@/hooks/useModalContext";
import Dialog from "react-native-dialog";
import { StatusBar } from "expo-status-bar";

export type ModalDataType = {
  title: string;
  description?: string;
  btn1: ModalButtonType;
  btn2?: ModalButtonType;
};

type ModalButtonType = {
  text: string;
  readonly type: "confirm" | "cancel";
  color?: ModalButtonColorType;
  onPress?: () => void;
};

type ModalButtonColorType = "danger" | "primary" | "default";

export default function Modal() {
  const { visible, handleCancel, handleConfirmation, modalData } = useModalContext();

  const { title, description, btn1, btn2 } = modalData;

  return (
    <>
      <StatusBar backgroundColor={visible ? "black" : undefined} />

      <Dialog.Container
        visible={visible}
        contentStyle={{ borderRadius: 24 }}
        onBackdropPress={handleCancel}
      >
        <Dialog.Title style={{ fontFamily: "Poppins-Bold", color: "black" }}>{title}</Dialog.Title>

        {description && (
          <Dialog.Description style={{ fontFamily: "Poppins-Medium", color: "black" }}>
            {description}
          </Dialog.Description>
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
            ? "red"
            : btn.color === "primary"
            ? "rgb(59 130 246)"
            : "black",
      }}
      label={btn.text}
      onPress={onPress}
    />
  );
}
