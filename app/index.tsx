import { Redirect } from "expo-router";
import { useGlobalContext } from "../hooks/useGlobalContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <LoadingSpinner />

      {isLoggedIn ? <Redirect href="/orders" /> : <Redirect href="/signIn" />}

      {!isLoggedIn && <Redirect href="/signIn" />}
    </>
  );
}
