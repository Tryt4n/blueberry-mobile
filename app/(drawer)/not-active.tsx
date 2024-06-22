import { useGlobalContext } from "@/hooks/useGlobalContext";
import { Redirect } from "expo-router";
import NotVerifiedAccountMessage from "@/components/NotVerifiedAccountMessage";

export default function NotActive() {
  const { isUserVerified } = useGlobalContext();

  if (isUserVerified) {
    return <Redirect href="/" />;
  } else {
    return <NotVerifiedAccountMessage />;
  }
}
