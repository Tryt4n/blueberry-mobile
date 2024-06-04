import { BaseToast, type BaseToastProps } from "react-native-toast-message";
import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.greenLight }}
      contentContainerStyle={{ backgroundColor: colors.bgLight }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textLight },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textLight },
        props.text2Style,
      ])}
    />
  ),
  successDark: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.greenDark }}
      contentContainerStyle={{ backgroundColor: colors.bgAccentDark }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textDark },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textDark },
        props.text2Style,
      ])}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      style={{ borderLeftColor: colors.primaryLight }}
      contentContainerStyle={{ backgroundColor: colors.bgLight }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textLight },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textLight },
        props.text2Style,
      ])}
      {...props}
    />
  ),
  infoDark: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.primaryDark }}
      contentContainerStyle={{ backgroundColor: colors.bgAccentDark }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textDark },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: colors.textDark },
        props.text2Style,
      ])}
    />
  ),
};
