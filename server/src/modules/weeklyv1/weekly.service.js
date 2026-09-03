import { fetchDailyEnergy } from "./weekly.query.js";
import { computeEnergyMetrics } from "./weekly.translator.js";
import { startOfWeekKey } from "./weekly.util.js";

export async function getWeeklyOverview(userId) {
  const weekStart = startOfWeekKey();

  const dailyEnergy = await fetchDailyEnergy(userId, weekStart);

  return {
    weekStart,
    energy: computeEnergyMetrics(dailyEnergy),
    daily: dailyEnergy,
  };
}
