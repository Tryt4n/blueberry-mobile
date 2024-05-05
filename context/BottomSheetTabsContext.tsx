import { getCurrentPrice } from "@/api/appwrite/currentPrice";
import { useAppwrite } from "@/hooks/useAppwrite";
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);

  const handleOpenBottomSheet = () => bottomSheetModalRef.current?.expand();

  const handleCloseBottomSheet = () => bottomSheetModalRef.current?.close();

  // const snapToIndex = (index:number) => bottomSheetModalRef.current?.snapToIndex(index);

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
    snapPoints,
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
