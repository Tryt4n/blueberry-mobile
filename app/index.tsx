import { Redirect } from "expo-router";
import { useGlobalContext } from "../hooks/useGlobalContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function App() {
  const { isLoading, isLoggedIn, isUserVerified } = useGlobalContext();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <LoadingSpinner />

      {!isLoading && isLoggedIn ? (
        <>{isUserVerified ? <Redirect href="/orders" /> : <Redirect href="/not-active" />}</>
      ) : (
        <Redirect href="/signIn" />
      )}
    </>
  );
}
