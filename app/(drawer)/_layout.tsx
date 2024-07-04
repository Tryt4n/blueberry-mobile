import { Drawer as SideMenu } from "expo-router/drawer";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import CustomDrawerContent from "@/components/Drawer/CustomDrawerContent";
import CustomDrawerLabel from "@/components/Drawer/CustomDrawerLabel";
import CustomDrawerIcon from "@/components/Drawer/CustomDrawerIcon";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DrawerLayout() {
  const { isLoading, isLoggedIn, isUserVerified, height } = useGlobalContext();
  const { theme, colors } = useThemeContext();

  if (isLoading) return <LoadingSpinner />;

  if (!isLoading && !isLoggedIn) return <Redirect href="/signIn" />;

  return (
    <>
      <SideMenu
        screenOptions={{
          headerTitleStyle: {
            fontFamily: "Poppins-SemiBold",
            color: colors.textAccent,
          },
          headerTitleAlign: "center",
          drawerAllowFontScaling: true,
          drawerPosition: "right", // Places the drawer on the right side of the screen
          headerLeft: () => null, // Removes hamburger button from the header on the left side
          headerRight: () => <DrawerToggleButton tintColor={colors.textAccent} />, // Adds hamburger button with the functionality of opening the menu
          headerStyle: {
            backgroundColor: colors.bg,
            borderBottomColor: colors.border,
            shadowColor: theme === "dark" ? "transparent" : undefined,
          },
          drawerStyle: { backgroundColor: colors.bg },
          sceneContainerStyle: { backgroundColor: colors.bgAccent },
        }}
        drawerContent={CustomDrawerContent}
      >
        <SideMenu.Screen
          name="(tabs)"
          options={{
            title: "Główna",
            headerTitleStyle: { display: "none" },
            drawerItemStyle: isUserVerified ? undefined : { display: "none" },
            drawerLabel: ({ color, focused }) => (
              <CustomDrawerLabel
                color={color}
                focused={focused}
                text="Główna"
              />
            ),
            drawerIcon: ({ color, size, focused }) => (
              <CustomDrawerIcon
                name="home-outline"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <SideMenu.Screen
          name="settings"
          options={{
            title: "Ustawienia",
            drawerLabel: ({ color, focused }) => (
              <CustomDrawerLabel
                color={color}
                focused={focused}
                text="Ustawienia"
              />
            ),
            drawerIcon: ({ color, size, focused }) => (
              <CustomDrawerIcon
                name="settings-outline"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <SideMenu.Screen
          name="logOut"
          options={{
            title: "Wyloguj się",
            headerTitleStyle: { display: "none" },
            drawerLabel: ({ color, focused }) => (
              <CustomDrawerLabel
                color={color}
                focused={focused}
                text="Wyloguj się"
              />
            ),
            drawerIcon: ({ color, size, focused }) => (
              <CustomDrawerIcon
                name="log-out-outline"
                size={size}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <SideMenu.Screen
          name="not-active"
          options={{
            headerTitleStyle: { display: "none" },
            drawerItemStyle: { display: "none" },
          }}
        />
      </SideMenu>
    </>
  );
}
