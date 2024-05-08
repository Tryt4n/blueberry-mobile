import { ModalContext } from "@/context/ModalContext";
import { useContext } from "react";

export function useModalContext() {
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error("useModalContext must be used within a ModalContextProvider");
  }

  return modalContext;
}
