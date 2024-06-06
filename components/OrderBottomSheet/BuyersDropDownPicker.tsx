import {
  useEffect,
  useState,
  memo,
  forwardRef,
  type ComponentProps,
  type ForwardedRef,
} from "react";
import { CustomDropDownPicker } from "../CustomDropDownPicker";
import type { Buyer } from "@/types/buyers";
import type { TextInput } from "react-native";

type BuyersDropDownPickerProps = {
  buyers?: Buyer[];
} & Omit<ComponentProps<typeof CustomDropDownPicker>, "items" | "setItems" | "label">;

function InnerBuyersDropDownPicker(
  { buyers, ...props }: BuyersDropDownPickerProps,
  ref: ForwardedRef<TextInput>
) {
  const [items, setItems] = useState<Record<"label" | "value", string>[]>([]);

  useEffect(() => {
    buyers &&
      setItems(buyers?.map((buyer) => ({ label: buyer.buyerName, value: buyer.buyerName })));
  }, [buyers]);

  return (
    <CustomDropDownPicker
      label="Kupujący:"
      placeholder="Wprowadź nazwę osoby zamawiającej"
      listMode="MODAL"
      items={items}
      addCustomItem={true}
      setItems={setItems}
      {...props}
      ref={ref}
    />
  );
}

export const BuyersDropDownPicker = memo(forwardRef(InnerBuyersDropDownPicker));
