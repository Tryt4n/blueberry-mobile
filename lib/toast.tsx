import { BaseToast, type BaseToastProps } from "react-native-toast-message";
import { StyleSheet } from "react-native";

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#22c55e" }}
      contentContainerStyle={{ backgroundColor: `white` }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "black" },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "black" },
        props.text2Style,
      ])}
    />
  ),
  successDark: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#1b9e4b" }}
      contentContainerStyle={{ backgroundColor: `#1f2223` }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "#E8E6E3" },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "#E8E6E3" },
        props.text2Style,
      ])}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      style={{ borderLeftColor: "#3B82F6" }}
      contentContainerStyle={{ backgroundColor: `white` }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "black" },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "black" },
        props.text2Style,
      ])}
      {...props}
    />
  ),
  infoDark: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#0844a6" }}
      contentContainerStyle={{ backgroundColor: `#1f2223` }}
      text1Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "#E8E6E3" },
        props.text1Style,
      ])}
      text2Style={StyleSheet.flatten([
        { textAlign: "left", fontSize: 16, color: "#E8E6E3" },
        props.text2Style,
      ])}
    />
  ),
};
