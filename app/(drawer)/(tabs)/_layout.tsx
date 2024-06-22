import { Redirect, Tabs } from "expo-router";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import TabIcon from "@/components/TabIcon";

export default function TabsLayout() {
  const { user, isLoading, isLoggedIn, isUserVerified } = useGlobalContext();
  const { colors } = useThemeContext();

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  if (!isLoading && isLoggedIn && !isUserVerified) return <Redirect href="/not-active" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: 84, backgroundColor: colors.bg, borderTopColor: colors.border },
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
              focused={focused}
            />
          ),
          tabBarItemStyle: userHasAccess ? { display: "flex" } : { display: "none" },
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
              focused={focused}
            />
          ),
          tabBarItemStyle: userHasAccess ? { display: "flex" } : { display: "none" },
        }}
      />
    </Tabs>
  );
}
