import { View, Text } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from "react-native-popup-menu";
import { colors } from "@/helpers/colors";
import tw from "@/lib/twrnc";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import type { OrderOption } from "./OrderCardOptions";

export default function OrderCardMenuOptions({ options }: { options: OrderOption[] }) {
  const { SlideInMenu } = renderers;

  return (
    <Menu renderer={SlideInMenu}>
      <MenuTrigger>
        <Ionicons
          name="ellipsis-vertical"
          size={32}
          color={colors.primary}
        />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: tw`py-8 px-4 rounded-2xl shadow-2xl`,
        }}
      >
        {options.map((option) => (
          <MenuOption
            key={option.text}
            onSelect={option.onSelect}
          >
            <View style={tw`flex flex-row justify-center items-center gap-2 py-2`}>
              <FontAwesome
                name={option.icon.name}
                size={24}
                color={colors[option.icon.color]}
              />
              <Text style={tw`font-poppinsSemiBold text-base`}>{option.text}</Text>
            </View>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
}
