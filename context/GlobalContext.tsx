import { Alert, Platform } from "react-native";
import { createContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/api/auth/appwrite";
import type { User } from "../types/user";
import type { AuthProviders } from "@/types/authProviders";

type GlobalContextValues = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isLoading: boolean;
  authProvider: AuthProviders;
  setAuthProvider: (value: AuthProviders) => void;
  platform: typeof Platform.OS | undefined;
  showAlert: (title: string, message: string) => void;
};

export const GlobalContext = createContext<GlobalContextValues | null>(null);

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState<AuthProviders>("appwrite");
  const platform = useMemo(() => Platform.OS, []);

  function showAlert(title: string, message: string) {
    if (platform === "web") {
      return window.alert(message);
    } else {
      return Alert.alert(title, message);
    }
  }

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const contextValues: GlobalContextValues = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    isLoading,
    authProvider,
    setAuthProvider,
    platform,
    showAlert,
  };

  return <GlobalContext.Provider value={contextValues}>{children}</GlobalContext.Provider>;
}
