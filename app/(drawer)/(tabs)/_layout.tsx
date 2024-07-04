import { Redirect, Tabs } from "expo-router";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import TabIcon from "@/components/TabIcon";

export default function TabsLayout() {
  const { user, isLoading, isLoggedIn, isUserVerified, height } = useGlobalContext();
  const { colors } = useThemeContext();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  if (!isLoading && isLoggedIn && !isUserVerified) return <Redirect href="/not-active" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: height > 680 ? 84 : 50,
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
        },
      }}
      sceneContainerStyle={{ backgroundColor: colors.bgAccent }}
    >
      <Tabs.Screen
        name="orders"
        options={{
          title: "Zamówienia",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="cart"
              color={color}
              name="Zamówienia"
              iconsSize={height > 680 ? 24 : 20}
              gap={height > 680 ? 2 : 0}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(fertigation)"
        options={{
          title: "Fertygacja",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="leaf"
              color={color}
              name="Fertygacja"
              iconsSize={height > 680 ? 24 : 20}
              gap={height > 680 ? 2 : 0}
              focused={focused}
            />
          ),
          // tabBarItemStyle: userHasAccess ? { display: "flex" } : { display: "none" },
          tabBarItemStyle: { display: "none" }, //! Remove this line after adding the content
        }}
      />

      <Tabs.Screen
        name="weather"
        options={{
          title: "Pogoda",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="sunny"
              color={color}
              name="Pogoda"
              iconsSize={height > 680 ? 24 : 20}
              gap={height > 680 ? 2 : 0}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="management"
        options={{
          title: "Zarządzanie",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="wallet"
              color={color}
              name="Zarządzanie"
              iconsSize={height > 680 ? 24 : 20}
              gap={height > 680 ? 2 : 0}
              focused={focused}
            />
          ),
          // tabBarItemStyle: userHasAccess ? { display: "flex" } : { display: "none" },
          tabBarItemStyle: { display: "none" }, //! Remove this line after adding the content
        }}
      />
    </Tabs>
  );
}
