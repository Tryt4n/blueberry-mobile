import { memo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useChangeCheckboxValue } from "@/hooks/OrderHooks/useChangeCheckboxValue";
import Checkbox from "../Checkbox";
import type { Order } from "@/types/orders";

function OrderCardIssuedCheckbox({ order }: { order: Order }) {
  const { user } = useGlobalContext();
  const { colors } = useThemeContext();
  const changeCompletedStatus = useChangeCheckboxValue(order, "issued");

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  return (
    <Checkbox
      label="Skompletowane:"
      status={order.issued}
      fillColor={colors.green}
      disabled={!userHasAccess || order.completed}
      onPress={() => {
        // If the order is completed or the user doesn't have access, return
        if (!userHasAccess || order.completed) return;

        changeCompletedStatus();
      }}
    />
  );
}

export default memo(OrderCardIssuedCheckbox);
