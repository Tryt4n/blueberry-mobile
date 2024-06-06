import { memo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useChangeCheckboxValue } from "@/hooks/OrderHooks/useChangeCheckboxValue";
import Checkbox from "../Checkbox";
import type { Order } from "@/types/orders";

function OrderCardCompleteCheckbox({ order }: { order: Order }) {
  const { user } = useGlobalContext();
  const changeCompletedStatus = useChangeCheckboxValue(order, "completed");

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  return (
    <Checkbox
      label="Ukończone:"
      status={order.completed}
      disabled={order.user.$id !== user?.$id && !userHasAccess}
      onPress={() => {
        // If the user is not the creator of the order and doesn't have access, return
        if (user && order.user.$id !== user.$id && !userHasAccess) return;

        changeCompletedStatus();
      }}
    />
  );
}

export default memo(OrderCardCompleteCheckbox);
