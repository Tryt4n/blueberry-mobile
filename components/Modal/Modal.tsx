import { View, Text, type TextInput } from "react-native";
import { Modal as ReactNativePaperModal, Portal } from "react-native-paper";
import tw from "@/lib/twrnc";
import { useModalContext } from "@/hooks/useModalContext";
import ModalButton from "./ModalButton";
import ModalInput from "./ModalInput";
import ModalCalendar from "./ModalCalendar";
import type { ComponentProps } from "react";
import type { ModalButtonType } from "./ModalButton";
import type { Calendar } from "react-native-calendars";

export type ModalProps = {
  title: string;
  subtitle?: string;
  btn1?: ModalButtonType;
  btn2?: ModalButtonType;
  input?: ComponentProps<typeof TextInput>;
  calendar?: ComponentProps<typeof Calendar>;
  children?: React.ReactNode;
  onDismiss?: () => void;
};

export default function Modal() {
  const { visible, closeModal, modalData } = useModalContext();
  const { title, subtitle, btn1, btn2, input, calendar, children, onDismiss } = modalData;

  function closeModalWithOnDismiss() {
    closeModal();
    onDismiss && onDismiss();
  }

  return (
    <Portal>
      <ReactNativePaperModal
        visible={visible}
        onDismiss={closeModalWithOnDismiss}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 20,
          maxWidth: "80%",
          alignSelf: "center",
        }}
      >
        <Text style={tw`font-poppinsBold text-xl mb-2`}>{title}</Text>

        {subtitle && <Text style={tw`font-poppinsMedium text-base`}>{subtitle}</Text>}

        {input && <ModalInput {...input} />}

        {calendar && <ModalCalendar {...calendar} />}

        {children && children}

        <View style={tw`flex flex-row justify-end mt-4`}>
          {btn1 && (
            <ModalButton
              btn={btn1}
              closeModalFn={closeModalWithOnDismiss}
            />
          )}

          {btn2 && (
            <ModalButton
              btn={btn2}
              closeModalFn={closeModal}
            />
          )}
        </View>
      </ReactNativePaperModal>
    </Portal>
  );
}
