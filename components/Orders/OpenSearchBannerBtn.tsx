import { TouchableOpacity } from "react-native";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import TabIcon from "../TabIcon";

export default function OpenSearchBannerBtn() {
  const { isBannerVisible, setIsBannerVisible } = useOrdersContext();

  return (
    <>
      {!isBannerVisible && (
        <TouchableOpacity
          activeOpacity={0.7}
          className="absolute left-0 bottom-4 z-10 bg-blue-500 p-4 rounded-full"
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
