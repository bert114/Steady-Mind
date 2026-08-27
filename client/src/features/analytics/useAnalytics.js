import { useCallback, useEffect, useState } from "react";
import { fetchAnalytics } from "./analytics.service.js";

export function useAnalytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setData(await fetchAnalytics());
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Analytics could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
    const handleFocus = () => loadAnalytics();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadAnalytics]);

  return { data, isLoading, error, refetch: loadAnalytics };
}
