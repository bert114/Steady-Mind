import { useCallback, useEffect, useState } from "react";
import { fetchCurrentWeek } from "./weekly.service.js";

export function useWeekly() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeekly = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setData(await fetchCurrentWeek());
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Your weekly summary could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeekly();
    const handleFocus = () => loadWeekly();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadWeekly]);

  return { data, isLoading, error, refetch: loadWeekly };
}