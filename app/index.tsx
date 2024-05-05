import React from "react";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../hooks/useGlobalContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoading) return <LoadingSpinner color="rgb(59 130 246)" />;

  return (
    <>
      <LoadingSpinner color="rgb(59 130 246)" />

      {isLoggedIn ? <Redirect href="/orders" /> : <Redirect href="/signIn" />}

      {!isLoggedIn && <Redirect href="/signIn" />}
    </>
  );
}
