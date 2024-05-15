import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useAppwrite<T>(
  fn: (...args: any[]) => Promise<T>,
  args: any[],
  errorMessage?: { title: string; message: string }
) {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fn(...args);
      setData(response);
    } catch (error: any) {
      errorMessage
        ? Alert.alert(errorMessage.title, errorMessage.message)
        : Alert.alert("Błąd", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [args]);

  const refetchData = () => fetchData();

  useEffect(() => {
    fetchData();
  }, []);

  return { data, refetchData, isLoading };
}
