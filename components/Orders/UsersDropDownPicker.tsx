import { Text } from "react-native";
import { useEffect, useState, type ComponentProps } from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";
import { CustomDropDownPicker } from "../CustomDropDownPicker";
import type { User } from "@/types/user";

type UsersDropDownPickerProps = {
  users?: User[];
} & Omit<ComponentProps<typeof CustomDropDownPicker>, "items" | "setItems" | "label">;

export function UsersDropDownPicker({ users, ...props }: UsersDropDownPickerProps) {
  const { colors } = useThemeContext();
  const [items, setItems] = useState<Record<"label" | "value", string>[]>([]);

  useEffect(() => {
    users && setItems(users?.map((user) => ({ label: user.username, value: user.$id })));
  }, [users]);

  return (
    <CustomDropDownPicker
      label="Użytkownik:"
      placeholder="Wprowadź użytkownika"
      listMode="MODAL"
      items={items}
      addCustomItem={false}
      setItems={setItems}
      ListEmptyComponent={() => (
        <Text style={tw`font-poppinsSemiBold text-base text-center text-[${colors.text}]`}>
          Brak wyników
        </Text>
      )}
      {...props}
    />
  );
}
