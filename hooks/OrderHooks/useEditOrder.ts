import { useCallback } from "react";
import { useBottomSheetContext } from "@/hooks/useBottomSheetContext";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import type { Order } from "@/types/orders";

export function useEditOrder(order: Order) {
  const { user } = useGlobalContext();
  const { setEditedOrder } = useOrdersContext();
  const { handleOpenBottomSheet } = useBottomSheetContext();

  // Open the bottom sheet with the order data to edit
  const openEditOrderBottomSheet = useCallback(() => {
    if (
      user &&
      (user.$id === order.user.$id || user.role === "admin" || user.role === "moderator")
    ) {
      setEditedOrder(order);
      handleOpenBottomSheet();
    }
  }, [user, order, setEditedOrder, handleOpenBottomSheet]);

  return openEditOrderBottomSheet;
}
