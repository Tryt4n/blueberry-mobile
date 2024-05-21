import React, { type ComponentProps } from "react";
import { colors } from "@/helpers/colors";
import BouncyCheckbox from "react-native-bouncy-checkbox/build/dist/BouncyCheckbox";
import { Entypo } from "@expo/vector-icons";

type CheckboxProps = {
  status: boolean;
} & ComponentProps<typeof BouncyCheckbox>;

export default function Checkbox({ status, ...props }: CheckboxProps) {
  return (
    <BouncyCheckbox
      size={50}
      fillColor={colors.primary}
      unFillColor="white"
      disableText={true}
      isChecked={status}
      iconComponent={
        <Entypo
          name="check"
          size={30}
          color={status ? "white" : "hsl(0, 0%, 97%)"}
        />
      }
      innerIconStyle={{ borderWidth: status ? 0 : 2 }}
      textStyle={{ fontFamily: "Poppins-Medium" }}
      {...props}
    />
  );
}
