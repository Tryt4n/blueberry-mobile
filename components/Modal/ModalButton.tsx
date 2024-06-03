import { Text, TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { colors as customColors } from "@/helpers/colors";
import tw from "@/lib/twrnc";

type ModalButtonProps = {
  btn: ModalButtonType;
  closeModalFn: () => void;
};

export type ModalButtonType = {
  text?: string;
  color?: ModalButtonColorType;
  onPress?: () => void;
};

type ModalButtonColorType = "danger" | "primary" | "default";

export default function ModalButton({ btn, closeModalFn }: ModalButtonProps) {
  const { colors } = useThemeContext();

  return (
    <TouchableOpacity
      onPress={() => {
        btn.onPress && btn.onPress();
        closeModalFn();
      }}
    >
      <Text
        style={tw`font-poppinsMedium text-base px-2 ${
          btn.color && btn.color === "danger"
            ? `text-[${colors.danger}]`
            : btn.color === "primary"
            ? `text-[${customColors.primaryLight}]`
            : `text-[${colors.text}]`
        }`}
      >
        {btn.text}
      </Text>
    </TouchableOpacity>
  );
}
