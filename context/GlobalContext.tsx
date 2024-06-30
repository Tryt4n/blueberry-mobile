import { Alert, Dimensions, Platform } from "react-native";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/api/auth/appwrite";
import type { User } from "@/types/user";

type GlobalContextValues = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isUserVerified: boolean | undefined;
  setIsUserVerified: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isLoading: boolean;
  isSimplifiedView: boolean | undefined;
  setIsSimplifiedView: (value: boolean) => void;
  platform: typeof Platform.OS | undefined;
  showAlert: (title: string, message: string) => void;
  refetchUser: () => Promise<void>;
  width: number;
  height: number;
};

export const GlobalContext = createContext<GlobalContextValues | null>(null);

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimplifiedView, setIsSimplifiedView] = useState<boolean | undefined>(undefined);
  const platform = useMemo(() => Platform.OS, []);
  const dimensions = Dimensions.get("window");

  function showAlert(title: string, message: string) {
    if (platform === "web") {
      return window.alert(message);
    } else {
      return Alert.alert(title, message);
    }
  }

  const getAndSetUser = useCallback(async () => {
    try {
      const result = await getCurrentUser();

      if (result) {
        setUser(result.user);
        setIsSimplifiedView(result.user.simplifiedView);
        setIsVerified(result.isUserVerified);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSetUser();
  }, []);

  const contextValues: GlobalContextValues = {
    isLoggedIn,
    setIsLoggedIn,
    isUserVerified: isVerified,
    setIsUserVerified: setIsVerified,
    user,
    setUser,
    refetchUser: getAndSetUser,
    isLoading,
    isSimplifiedView,
    setIsSimplifiedView,
    platform,
    showAlert,
    width: dimensions.width,
    height: dimensions.height,
  };

  return <GlobalContext.Provider value={contextValues}>{children}</GlobalContext.Provider>;
}
