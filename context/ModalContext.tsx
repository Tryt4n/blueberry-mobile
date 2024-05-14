import { createContext, useState } from "react";
import type { ModalProps } from "@/components/Modal/Modal";

type ModalContextType = {
  visible: boolean;
  showModal: () => void;
  closeModal: () => void;
  modalData: ModalProps;
  setModalData: (data: ModalProps | ((prevData: ModalProps) => ModalProps)) => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalContextProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const modalDataInitialState: ModalProps = {
    title: "",
  };
  const [modalData, setModalData] = useState<ModalProps>(modalDataInitialState);

  function showModal() {
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
  }

  const contextValues: ModalContextType = {
    visible,
    showModal,
    closeModal,
    modalData,
    setModalData,
  };

  return <ModalContext.Provider value={contextValues}>{children}</ModalContext.Provider>;
}
