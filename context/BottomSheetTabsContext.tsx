import { createContext, useRef } from "react";
import type { ActionSheetRef } from "react-native-actions-sheet";

type BottomSheetTabsContextType = {
  bottomSheetModalRef: React.RefObject<ActionSheetRef>;
  handleOpenBottomSheet: () => void;
  handleCloseBottomSheet: () => void;
};

export const BottomSheetTabsContext = createContext<BottomSheetTabsContextType | null>(null);

export default function BottomSheetTabsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bottomSheetModalRef = useRef<ActionSheetRef>(null);

  const handleOpenBottomSheet = () => bottomSheetModalRef.current?.show();
  const handleCloseBottomSheet = () => bottomSheetModalRef.current?.hide();

  const contextValues: BottomSheetTabsContextType = {
    bottomSheetModalRef,
    handleOpenBottomSheet,
    handleCloseBottomSheet,
  };

  return (
    <BottomSheetTabsContext.Provider value={contextValues}>
      {children}
    </BottomSheetTabsContext.Provider>
  );
}
