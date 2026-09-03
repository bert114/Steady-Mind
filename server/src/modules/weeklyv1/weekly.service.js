import {
  fetchDailyLogs,
  fetchWeekInteractions,
} from "./weekly.query.js";
import {
  computeDrainMetrics,
  computeEnergyMetrics,
  computeMoodMetrics,
  findHighestDrainingRelationship,
} from "./weekly.translator.js";
import { startOfWeekKey } from "./weekly.util.js";

export async function getWeeklyOverview(userId) {
  const weekStart = startOfWeekKey();

  const [dailyLogs, interactions] = await Promise.all([
    fetchDailyLogs(userId, weekStart),
    fetchWeekInteractions(userId, weekStart),
  ]);

  return {
    weekStart,
    energy: computeEnergyMetrics(dailyLogs),
    mood: computeMoodMetrics(dailyLogs),
    drain: computeDrainMetrics(interactions),
    highestDrainingRelationship: findHighestDrainingRelationship(interactions),
    daily: dailyLogs,
    interactions,
  };
}
