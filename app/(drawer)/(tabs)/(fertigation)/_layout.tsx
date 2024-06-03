import { Tabs } from "expo-router";
import { useThemeContext } from "@/hooks/useThemeContext";
import TabIcon from "@/components/TabIcon";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

export default function FertigationTabsLayout() {
  const { colors } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          top: "5%",
          maxWidth: 400,
          marginHorizontal: "auto",
          height: 60,
          borderRadius: 50,
          backgroundColor: colors.bg,
          borderTopWidth: 0,
          shadowColor: colors.border,
          shadowOffset: {
            width: -1,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
      }}
      sceneContainerStyle={{ backgroundColor: colors.bgAccent }}
    >
      <Tabs.Screen
        name="fertilizers"
        options={{
          title: "Nawozy",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              name="Nawozy"
              focused={focused}
              gap={0}
              iconsSize={20}
              customIcon={
                <FontAwesome6
                  name="poop"
                  size={20}
                  color={color}
                />
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="spraying"
        options={{
          title: "Opryski",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              name="Opryski"
              focused={focused}
              gap={0}
              iconsSize={20}
              customIcon={
                <MaterialCommunityIcons
                  name="spray-bottle"
                  size={20}
                  color={color}
                />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
