import { View, Text, type TextInput, type TextInputProps } from "react-native";
import React, { forwardRef, useEffect, useState, type ForwardedRef } from "react";
import DropDownPicker, { type DropDownPickerProps } from "react-native-dropdown-picker";
import { Entypo, Ionicons } from "@expo/vector-icons";

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
    <View className="my-4">
      <Text className="pb-1 text-base font-medium">{label}</Text>
      <DropDownPicker //@ts-expect-error - bug related with props spreading (different props for multiple and single)
        select
        listMode="SCROLLVIEW"
        activityIndicatorColor="rgb(59 130 246)"
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
          borderColor: open && !isSearchFocused ? "rgb(59 130 246)" : "black",
        }}
        textStyle={{ fontFamily: "Poppins-SemiBold", textTransform: "capitalize" }}
        labelStyle={{ fontSize: 18, fontFamily: "Poppins-SemiBold" }}
        customItemLabelStyle={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          color: "rgb(59 130 246)",
          fontWeight: "bold",
        }}
        disabledStyle={{ opacity: 0.5 }}
        ArrowUpIconComponent={() => (
          <Ionicons
            name="chevron-up"
            size={24}
            color="rgb(59 130 246)"
          />
        )}
        ArrowDownIconComponent={() => (
          <Ionicons
            name="chevron-down"
            size={24}
            color="rgb(59 130 246)"
          />
        )}
        TickIconComponent={() => (
          <Entypo
            name="check"
            size={24}
            color="rgb(59 130 246)"
          />
        )}
        placeholderStyle={{ fontFamily: "Poppins-SemiBold", color: "#7B7B8B", fontSize: 14 }}
        listItemLabelStyle={{ fontFamily: "Poppins-SemiBold", fontSize: 16, textAlign: "center" }}
        searchContainerStyle={{
          paddingVertical: 24,
          borderBottomWidth: 0,
        }}
        searchTextInputProps={{
          maxLength: 100,
          cursorColor: "rgb(59 130 246)",
          autoCapitalize: "words",
          ref: searchInputRef,
          onFocus: () => setSearchFocused(true),
          onBlur: () => setSearchFocused(false),
        }}
        searchTextInputStyle={{
          fontFamily: "Poppins-SemiBold",
          fontSize: 16,
          borderWidth: 2,
          borderColor: isSearchFocused ? "rgb(59 130 246)" : "black",
        }}
        dropDownContainerStyle={{
          borderColor: open && !isSearchFocused ? "rgb(59 130 246)" : "black",
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
          color: "rgb(59 130 246)",
        }}
        listItemContainerStyle={{ height: 40 }}
        {...props}
      />
    </View>
  );
}

export const CustomDropDownPicker = forwardRef(InnerCustomDropDownPicker);
