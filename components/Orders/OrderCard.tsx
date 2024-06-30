import { memo } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import SimplifiedOrderCard from "./SimplifiedOrderCard";
import DetailedOrderCard from "./DetailedOrderCard";
import type { Order } from "@/types/orders";
import type { CurrentPrice } from "@/types/currentPrice";

type OrderCardProps = {
  order: Order;
  price: CurrentPrice["price"] | null;
  additionalStyles?: string;
  index: number;
};

function OrderCard({ order, price, additionalStyles, index }: OrderCardProps) {
  const { isSimplifiedView } = useGlobalContext();
  const { colors } = useThemeContext();

  return (
    <>
      {isSimplifiedView ? (
        <SimplifiedOrderCard
          type="edit"
          order={order}
          price={price}
          containerStyles={`${
            index && index % 2 === 0 ? `bg-[${colors.bg}]` : `bg-[${colors.bg}75]`
          }`}
        />
      ) : (
        <DetailedOrderCard
          order={order}
          price={price}
          additionalStyles={additionalStyles}
        />
      )}
    </>
  );
}

export default memo(OrderCard);
