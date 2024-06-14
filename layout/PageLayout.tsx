import { View } from "react-native";
import tw from "@/lib/twrnc";

export default function PageLayout({
  children,
  containerStyles,
}: {
  children: React.ReactNode;
  containerStyles?: string;
}) {
  return (
    <View style={tw`h-full w-[90%] mx-auto${containerStyles ? ` ${containerStyles}` : ""}`}>
      {children}
    </View>
  );
}
