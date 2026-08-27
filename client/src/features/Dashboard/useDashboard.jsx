import { useEffect } from "react";
import { useRecoveryHook } from "../recovery-f/useRecoveryHook.jsx";
import { fetchDashboardData } from "./dashboard.service.js";
import { useDashboardStore } from "./useDashboard.store.js";

export const useDashboard = (userId) => {
  const {
    dashboardData,
    isLoading,
    error,
    setDashboardData,
    setIsLoading,
    setError,
  } = useDashboardStore();

  const { addObject } = useRecoveryHook();

  useEffect(() => {
    if (!dashboardData) return;
    console.group("📊 Dashboard Data");

    console.log("🔋 Battery Level:", dashboardData?.batteryLevel);

    console.log("⚠️ Burnout Risk:", {
      level: dashboardData?.burnoutRisk?.riskLevel,
      title: dashboardData?.burnoutRisk?.title,
    });

    console.log("😊 Mood & Battery:", dashboardData?.moodAndBattery);

    console.log("🤝 Weekly Interactions:", {
      count: dashboardData?.weeklyInteraction?.length,
      data: dashboardData?.weeklyInteraction,
    });

    console.log("🏃 Recovery:", {
      riskLevel: dashboardData?.recoveryData?.riskLevel,
      activities: dashboardData?.recoveryData?.activities?.length,
      performance: dashboardData?.recoveryData?.performance,
    });

    console.groupEnd();
  }, [dashboardData]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardData(userId);

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
  }, [userId]);

  return {
    dashboardData,
    isLoading,
    error,
    refetch: loadData,
  };
};
