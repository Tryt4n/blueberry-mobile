import { Redirect } from "expo-router";
import { colors } from "@/helpers/colors";
import { useGlobalContext } from "../hooks/useGlobalContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoading) return <LoadingSpinner color={colors.primary} />;

  return (
    <>
      <LoadingSpinner color={colors.primary} />

      {isLoggedIn ? <Redirect href="/orders" /> : <Redirect href="/signIn" />}

      {!isLoggedIn && <Redirect href="/signIn" />}
    </>
  );
}
