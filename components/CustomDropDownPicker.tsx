import { View, Text, type TextInput, type TextInputProps } from "react-native";
import React, { forwardRef, useEffect, useState, type ForwardedRef } from "react";
import tw from "@/lib/twrnc";
import DropDownPicker, { type DropDownPickerProps } from "react-native-dropdown-picker";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { colors } from "@/helpers/colors";

type CustomDropDownPickerProps = {
  label: string;
  items: Record<"label" | "value", string>[];
  setItems: (items: Record<"label" | "value", string>[]) => void;
  defaultValue?: string;
  dropDownHeight?: number;
  searchTextInputProps?: { ref: ForwardedRef<TextInput> } & TextInputProps;
} & Omit<
  DropDownPickerProps<string>,
  "items" | "value" | "setValue" | "open" | "setOpen" | "multiple"
>;

function InnerCustomDropDownPicker(
  { label, items, setItems, defaultValue, dropDownHeight, ...props }: CustomDropDownPickerProps,
  searchInputRef: ForwardedRef<TextInput>
) {
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
      <Text style={tw`pb-1 text-base font-medium`}>{label}</Text>
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
          backgroundColor: "#dfdfdf",
        }}
        searchPlaceholder="Szukaj..."
        style={{
          borderWidth: 2,
          borderColor: open && !isSearchFocused ? colors.primary : "black",
        }}
        textStyle={{ fontFamily: "Poppins-SemiBold", textTransform: "capitalize" }}
        labelStyle={{ fontSize: 18, fontFamily: "Poppins-SemiBold" }}
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
            color={colors.primary}
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
          borderColor: isSearchFocused ? colors.primary : "black",
        }}
        dropDownContainerStyle={{
          borderColor: open && !isSearchFocused ? colors.primary : "black",
          borderTopWidth: 1,
          borderWidth: 2,
          shadowColor: "black",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 10,
          shadowOffset: { width: 0, height: 0 },
          maxHeight: dropDownHeight,
        }}
        selectedItemLabelStyle={{
          fontFamily: "Poppins-Bold",
          fontSize: 16,
          transform: [{ translateX: 16 }],
          color: colors.primary,
        }}
        listItemContainerStyle={{ height: 40 }}
        {...props}
      />
    </View>
  );
}

export const CustomDropDownPicker = forwardRef(InnerCustomDropDownPicker);
