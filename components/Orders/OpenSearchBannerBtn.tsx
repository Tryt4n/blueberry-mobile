import { TouchableOpacity } from "react-native";
import tw from "@/lib/twrnc";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import TabIcon from "../TabIcon";

export default function OpenSearchBannerBtn() {
  const { isBannerVisible, setIsBannerVisible } = useOrdersContext();

  return (
    <>
      {!isBannerVisible && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={tw`absolute left-0 bottom-4 z-10 bg-primary p-4 rounded-full`}
          aria-label="Wyszukaj zamówienia"
          onPress={() => setIsBannerVisible(true)}
        >
          <TabIcon
            color="white"
            icon="search"
            iconsSize={24}
          />
        </TouchableOpacity>
      )}
    </>
  );
}
