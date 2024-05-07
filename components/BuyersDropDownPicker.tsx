import { Dimensions, Text, View } from "react-native";
import React, { forwardRef, useEffect, useMemo, useState, type ForwardedRef } from "react";
import DropDownPicker, { type DropDownPickerProps } from "react-native-dropdown-picker";
import { Entypo, Ionicons } from "@expo/vector-icons";
import type { Buyer } from "@/types/buyers";
import type { TextInput, TextInputProps } from "react-native";

type BuyersDropDownPickerProps = {
  label: string;
  buyers?: Buyer[];
  multiple?: false;
  arrowIconStyle?: { tintColor: string };
  searchTextInputProps?: { ref: ForwardedRef<TextInput> } & TextInputProps;
} & Omit<
  DropDownPickerProps<string>,
  "items" | "value" | "setValue" | "open" | "setOpen" | "multiple"
>;

function InnerBuyersDropDownPicker(
  { label, buyers, ...props }: BuyersDropDownPickerProps,
  searchInputRef: ForwardedRef<TextInput>
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<Record<"label" | "value", string>[]>([]);
  const [isSearchFocused, setSearchFocused] = useState(false);

  const dropdownHeight = useMemo(() => {
    return Dimensions.get("window").height * 0.425;
  }, []);

  useEffect(() => {
    buyers &&
      setItems(buyers?.map((buyer) => ({ label: buyer.buyerName, value: buyer.buyerName })));
  }, [buyers]);

  return (
    <View className="my-4">
      <Text className="pb-1 text-base font-medium">{label}</Text>
      <DropDownPicker //@ts-expect-error - bug related with props spreading (different props for multiple and single)
        select
        activityIndicatorColor="rgb(59 130 246)"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        searchable={true}
        autoScroll={true}
        addCustomItem={true}
        closeOnBackPressed={true}
        itemSeparator={true}
        itemSeparatorStyle={{
          marginHorizontal: 64,
          backgroundColor: "#dfdfdf",
        }}
        placeholder="Wprowadź nazwę osoby zamawiającej"
        searchPlaceholder="Szukaj..."
        style={{
          borderWidth: 2,
          borderColor: open && !isSearchFocused ? "rgb(59 130 246)" : "black",
        }}
        textStyle={{ fontFamily: "Poppins-SemiBold", textTransform: "capitalize" }}
        labelStyle={{ fontSize: 18, fontFamily: "Poppins-SemiBold" }}
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
          onBlur: () => {
            setSearchFocused(false);
            setOpen(false);
          },
        }}
        searchTextInputStyle={{
          fontFamily: "Poppins-SemiBold",
          color: "#7B7B8B",
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
          height: dropdownHeight,
          maxHeight: dropdownHeight,
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

export const BuyersDropDownPicker = forwardRef(InnerBuyersDropDownPicker);
