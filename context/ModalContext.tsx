import { createContext, useState } from "react";
import type { ModalDataType } from "@/components/Modal";

type ModalContextType = {
  visible: boolean;
  showModal: () => void;
  handleCancel: () => void;
  handleConfirmation: () => void;
  modalData: ModalDataType;
  setModalData: (data: ModalDataType) => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalContextProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const modalDataInitialState: ModalDataType = {
    title: "",
    description: "",
    btn1: {
      text: "Ok",
      type: "confirm",
      color: "primary",
    },
  };
  const [modalData, setModalData] = useState(modalDataInitialState);

  function showModal() {
    setVisible(true);
  }

  function handleCancel() {
    modalData.btn2 && modalData.btn2.onPress && modalData.btn2.onPress();
    setVisible(false);
    setModalData(modalDataInitialState);
  }

  function handleConfirmation() {
    modalData.btn1.onPress && modalData.btn1.onPress();
    setVisible(false);
    setModalData(modalDataInitialState);
  }

  const contextValues: ModalContextType = {
    visible,
    showModal,
    handleCancel,
    handleConfirmation,
    modalData,
    setModalData,
  };

  return <ModalContext.Provider value={contextValues}>{children}</ModalContext.Provider>;
}
