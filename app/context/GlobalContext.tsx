import React, { createContext, useEffect, useState, type ReactNode } from "react";
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

export default function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
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

  useEffect(() => {
    console.log(`Loading: ${isLoading}`);
    console.log(`Logged in: ${isLoggedIn}`);
  }, [isLoading, isLoggedIn]);

  // useEffect(() => {
  //   getCurrentUser()
  //     .then((res) => {
  //       if (res) {
  //         setIsLoggedIn(true);
  //         setUser(res);
  //       } else {
  //         setIsLoggedIn(false);
  //         setUser(null);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, []);

  const contextValues: GlobalContextValues = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    isLoading,
  };

  return <GlobalContext.Provider value={contextValues}>{children}</GlobalContext.Provider>;
}
