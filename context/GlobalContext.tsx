import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/api/auth/users";
import type { User } from "../types/user";

type GlobalContextValues = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isLoading: boolean;
};

export const GlobalContext = createContext<GlobalContextValues | null>(null);

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  };

  return <GlobalContext.Provider value={contextValues}>{children}</GlobalContext.Provider>;
}