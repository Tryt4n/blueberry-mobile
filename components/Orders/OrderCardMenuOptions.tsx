import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { BorderlessButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/helpers/colors";

type OrderCardMenuOptionsProps = {
  options: { text: string; onSelect: () => void }[];
};

export default function OrderCardMenuOptions({ options }: OrderCardMenuOptionsProps) {
  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: BorderlessButton,
        }}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={32}
          color={colors.primary}
        />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            width: "auto",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
          },
          optionText: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 16,
            color: "black",
            paddingHorizontal: 16,
            paddingVertical: 4,
            textAlign: "center",
          },
        }}
      >
        {options.map((option, index) => (
          <MenuOption
            key={index}
            text={option.text}
            onSelect={option.onSelect}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
}
