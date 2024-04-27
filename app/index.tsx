import React from "react";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../hooks/useGlobalContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoading) return <LoadingSpinner color="rgb(59 130 246)" />;

  if (!isLoading && isLoggedIn) return <Redirect href="/orders" />;

  if (!isLoading && !isLoggedIn) return <Redirect href="/signIn" />;
}
