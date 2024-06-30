import { memo, type ComponentPropsWithoutRef } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useChangeCheckboxValue } from "@/hooks/OrderHooks/useChangeCheckboxValue";
import Checkbox from "../Checkbox";
import type { Order } from "@/types/orders";

type OrderCardCompleteCheckboxProps = {
  order: Order;
} & Omit<ComponentPropsWithoutRef<typeof Checkbox>, "status">;

function OrderCardCompleteCheckbox({ order, ...props }: OrderCardCompleteCheckboxProps) {
  const { user, isSimplifiedView } = useGlobalContext();
  const changeCompletedStatus = useChangeCheckboxValue(order, "completed");

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  return (
    <Checkbox
      label={!isSimplifiedView ? "Ukończone:" : undefined}
      status={order.completed}
      disabled={order.user.$id !== user?.$id && !userHasAccess}
      onPress={() => {
        // If the user is not the creator of the order and doesn't have access, return
        if (user && order.user.$id !== user.$id && !userHasAccess) return;

        changeCompletedStatus();
      }}
      {...props}
    />
  );
}

export default memo(OrderCardCompleteCheckbox);
