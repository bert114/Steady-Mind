import { buildWeeklyInsight } from "./weekly.insight.js";
import {
  fetchLatestInsight,
  fetchWeeklyRows,
  upsertWeeklyInsight,
} from "./weekly.query.js";
import { startOfWeekKey } from "./weekly.utils.js";

export async function getCurrentWeekInsight(userId) {
  const weekStart = startOfWeekKey();
  const rows = await fetchWeeklyRows(userId, weekStart);
  const built = buildWeeklyInsight(rows);

  return await upsertWeeklyInsight({
    userId,
    weekStart,
    metrics: built.metrics,
    observations: built.observations,
  });
}

export async function getLatestInsight(userId) {
  return await fetchLatestInsight(userId);
}