import { TouchableOpacity } from "react-native";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import tw from "@/lib/twrnc";
import TabIcon from "../TabIcon";

export default function OpenSearchBannerBtn() {
  const { theme, colors } = useThemeContext();
  const { isBannerVisible, setIsBannerVisible } = useOrdersContext();

  return (
    <>
      {!isBannerVisible && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={tw`absolute left-0 bottom-4 z-10 bg-[${colors.primary}] p-4 rounded-full`}
          aria-label="Wyszukaj zamówienia"
          onPress={() => setIsBannerVisible(true)}
        >
          <TabIcon
            color={theme === "dark" ? colors.text : "white"}
            icon="search"
            iconsSize={24}
          />
        </TouchableOpacity>
      )}
    </>
  );
}
