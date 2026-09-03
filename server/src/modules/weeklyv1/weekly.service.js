import { fetchDailyLogs } from "./weekly.query.js";
import { computeEnergyMetrics, computeMoodMetrics } from "./weekly.translator.js";
import { startOfWeekKey } from "./weekly.util.js";

export async function getWeeklyOverview(userId) {
  const weekStart = startOfWeekKey();

  const dailyLogs = await fetchDailyLogs(userId, weekStart);

  return {
    weekStart,
    energy: computeEnergyMetrics(dailyLogs),
    mood: computeMoodMetrics(dailyLogs),
    daily: dailyLogs,
  };
}
