import { BottomSheetBackdrop, type BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { createContext, useCallback, useRef } from "react";
import type { ActionSheetRef } from "react-native-actions-sheet";

type BottomSheetTabsContextType = {
  bottomSheetModalRef: React.RefObject<ActionSheetRef>;
  handleOpenBottomSheet: () => void;
  handleCloseBottomSheet: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.ReactNode;
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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={handleCloseBottomSheet}
      />
    ),
    []
  );

  const contextValues: BottomSheetTabsContextType = {
    bottomSheetModalRef,
    handleOpenBottomSheet,
    handleCloseBottomSheet,
    renderBackdrop,
  };

  return (
    <BottomSheetTabsContext.Provider value={contextValues}>
      {children}
    </BottomSheetTabsContext.Provider>
  );
}
