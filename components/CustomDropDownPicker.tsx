import { View, Text, type TextInput, type TextInputProps } from "react-native";
import React, {
  useEffect,
  useState,
  memo,
  forwardRef,
  type ForwardedRef,
  type ComponentProps,
} from "react";
import { useThemeContext } from "@/hooks/useThemeContext";
import { colors as customColors } from "@/constants/colors";
import tw from "@/lib/twrnc";
import DropDownPicker, { type DropDownPickerProps } from "react-native-dropdown-picker";
import { Entypo, Ionicons } from "@expo/vector-icons";

type CustomDropDownPickerProps = {
  label: string;
  items: Record<"label" | "value", string>[];
  setItems: (items: Record<"label" | "value", string>[]) => void;
  defaultValue?: string;
  dropDownHeight?: number;
  searchTextInputProps?: { ref: ForwardedRef<TextInput> } & TextInputProps;
  closeIconStyle?: ComponentProps<typeof DropDownPicker>["closeIconStyle"] & { tintColor: string };
} & Omit<
  DropDownPickerProps<string>,
  "items" | "value" | "setValue" | "open" | "setOpen" | "multiple"
>;

function InnerCustomDropDownPicker(
  { label, items, setItems, defaultValue, dropDownHeight, ...props }: CustomDropDownPickerProps,
  searchInputRef: ForwardedRef<TextInput>
) {
  const { colors } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(defaultValue || null);
  const [isSearchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    } else {
      setValue(null);
    }
  }, [defaultValue]);

  return (
    <View style={tw`my-4`}>
      <Text style={tw`pb-1 font-poppinsSemiBold text-base font-medium text-[${colors.text}]`}>
        {label}
      </Text>
      <DropDownPicker
        select
        listMode="SCROLLVIEW"
        activityIndicatorColor={colors.primary}
        open={open}
        multiple={false}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        searchable={true}
        autoScroll={true}
        closeOnBackPressed={true}
        itemSeparator={true}
        itemSeparatorStyle={{
          marginHorizontal: 64,
          backgroundColor: colors.border,
        }}
        ListEmptyComponent={() => (
          <View style={tw`h-full items-center justify-center`}>
            <Text style={tw`font-poppinsSemiBold text-[${colors.text}]`}>Lista jest pusta</Text>
          </View>
        )}
        closeIconStyle={{ tintColor: colors.text }}
        searchPlaceholder="Szukaj..."
        style={{
          borderWidth: 2,
          borderColor: open && !isSearchFocused ? colors.primary : colors.inputBorder,
          backgroundColor: "transparent",
        }}
        textStyle={{
          fontFamily: "Poppins-SemiBold",
          textTransform: "capitalize",
          color: colors.text,
        }}
        labelStyle={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: colors.text }}
        customItemLabelStyle={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: colors.primary,
          fontWeight: "bold",
        }}
        disabledStyle={{ opacity: 0.5 }}
        ArrowUpIconComponent={() => (
          <Ionicons
            name="chevron-up"
            size={24}
            color={colors.primary}
          />
        )}
        ArrowDownIconComponent={() => (
          <Ionicons
            name="chevron-down"
            size={24}
            color={colors.primary}
          />
        )}
        TickIconComponent={() => (
          <Entypo
            name="check"
            size={24}
            color={customColors.primaryLight}
          />
        )}
        placeholderStyle={{
          fontFamily: "Poppins-SemiBold",
          color: colors.placeholder,
          fontSize: 14,
        }}
        listItemLabelStyle={{ fontFamily: "Poppins-SemiBold", fontSize: 16, textAlign: "center" }}
        searchContainerStyle={{
          paddingVertical: 24,
          borderBottomWidth: 0,
        }}
        searchTextInputProps={{
          maxLength: 100,
          cursorColor: colors.primary,
          autoCapitalize: "words",
          // @ts-ignore - `ref` is not recognized for <TextInput/>
          ref: searchInputRef,
          onFocus: () => setSearchFocused(true),
          onBlur: () => setSearchFocused(false),
        }}
        searchTextInputStyle={{
          fontFamily: "Poppins-SemiBold",
          fontSize: 16,
          borderWidth: 2,
          color: colors.text,
          // @ts-ignore - `caretColor` is not recognized for <TextInput/>
          caretColor: colors.primary,
          borderColor: isSearchFocused ? colors.primary : colors.inputBorder,
        }}
        searchPlaceholderTextColor={colors.placeholder}
        dropDownContainerStyle={{
          borderColor: open && !isSearchFocused ? colors.primary : colors.inputBorder,
          borderTopWidth: 1,
          borderWidth: 2,
          shadowColor: "black",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 10,
          shadowOffset: { width: 0, height: 0 },
          maxHeight: dropDownHeight,
          backgroundColor: colors.bg,
        }}
        selectedItemLabelStyle={{
          fontFamily: "Poppins-Bold",
          fontSize: 16,
          transform: [{ translateX: 16 }],
          color: customColors.primaryLight,
        }}
        listItemContainerStyle={{ height: 40 }}
        modalContentContainerStyle={{
          backgroundColor: colors.bg,
        }}
        {...props}
      />
    </View>
  );
}

export const CustomDropDownPicker = memo(forwardRef(InnerCustomDropDownPicker));
