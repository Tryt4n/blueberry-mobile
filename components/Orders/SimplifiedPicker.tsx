import { useThemeContext } from "@/hooks/useThemeContext";
import { boxSizeValues } from "@/constants/orders";
import tw from "@/lib/twrnc";
import { Picker } from "@react-native-picker/picker";
import type { ComponentProps } from "react";

type SimplifiedPickerProps = {
  boxSize: (typeof boxSizeValues)[number];
  quantity: number | null;
} & Omit<ComponentProps<typeof Picker>, "onValueChange">;

export default function SimplifiedPicker({ boxSize, quantity, ...props }: SimplifiedPickerProps) {
  const { colors } = useThemeContext();

  return (
    <Picker
      style={tw`w-30 font-poppinsRegular text-[${colors.textAccent}]${
        quantity && quantity < 0.5 ? ` opacity-25` : ""
      } bg-transparent border-0`}
      dropdownIconColor={colors.primary}
      {...props}
    >
      {boxSizeValues.map((value) => (
        <Picker.Item
          key={value}
          label={value}
          value={value}
          enabled={(quantity && quantity >= 0.5) || undefined}
          style={tw`${
            value === boxSize ? `text-[${colors.primary}]` : `text-[${colors.textAccent}]`
          }`}
        />
      ))}
    </Picker>
  );
}
