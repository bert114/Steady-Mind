import { useCallback, useEffect, useState } from "react";
import { fetchCurrentWeek } from "./weekly.service.js";

const DEFAULT_ERROR = "Your weekly summary could not be loaded.";

export function useWeeklySummary() {
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
          DEFAULT_ERROR,
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
