import { Divider as ReactNativeDivider } from "react-native-paper";
import { useThemeContext } from "@/hooks/useThemeContext";
import tw from "@/lib/twrnc";

export default function Divider({ style }: { style?: string }) {
  const { colors } = useThemeContext();

  return (
    <ReactNativeDivider
      style={[tw`my-6${style ? ` ${style}` : ""}`, { backgroundColor: colors.border }]}
    />
  );
}
