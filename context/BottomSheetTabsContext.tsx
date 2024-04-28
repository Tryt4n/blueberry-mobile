import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetModal,
} from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { createContext, useCallback, useMemo, useRef } from "react";

type BottomSheetTabsContextType = {
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  snapPoints: string[];
  handleOpenPress: () => void;
  handleClosePress: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.ReactNode;
};

export const BottomSheetTabsContext = createContext<BottomSheetTabsContextType | null>(null);

export default function BottomSheetTabsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);

  const handleOpenPress = () => bottomSheetModalRef.current?.expand();

  const handleClosePress = () => bottomSheetModalRef.current?.close();

  // const snapToIndex = (index:number) => bottomSheetModalRef.current?.snapToIndex(index);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={handleClosePress}
      />
    ),
    []
  );

  const contextValues: BottomSheetTabsContextType = {
    bottomSheetModalRef,
    snapPoints,
    handleOpenPress,
    handleClosePress,
    renderBackdrop,
  };

  return (
    <BottomSheetTabsContext.Provider value={contextValues}>
      {children}
    </BottomSheetTabsContext.Provider>
  );
}
