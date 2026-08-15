import { useEffect } from "react";
import { useDashboardStore } from "./useDashboard.store.js";
import { fetchDashboardData } from "./dashboard.service.js";
import { id } from "../test/id.js";

export const useDashboard = (userId) => {
  const {
    dashboardData,
    isLoading,
    error,
    setDashboardData,
    setIsLoading,
    setError,
  } = useDashboardStore();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardData(id);

      setDashboardData(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch dashboard data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return {
    dashboardData,
    isLoading,
    error,
    refetch: loadData,
  };
};
