import { router } from "expo-router";
import { View, Text } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";

export default function TabsManagement() {
  const { user, isLoading, isLoggedIn } = useGlobalContext();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  if (!isLoading && !userHasAccess) return router.replace("/");

  return (
    <>
      {isLoggedIn && userHasAccess && (
        <View>
          <Text>TabsManagement</Text>
        </View>
      )}
    </>
  );
}
