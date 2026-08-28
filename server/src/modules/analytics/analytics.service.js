import {
  buildHighDrainImpact,
  buildPatterns,
  buildRecovery,
  buildRelationships,
  buildTrend,
} from "./analytics.builders.js";
import { HIGH_DRAIN_THRESHOLD } from "./analytics.constants.js";
import { average, moodLabel } from "./analytics.helpers.js";
import { fetchAnalyticsRows } from "./analytics.query.js";

export async function getAnalytics(userId) {
  const { dailyLogs, interactions, recoveries } =
    await fetchAnalyticsRows(userId);

  console.log(interactions);

  const trend7d = buildTrend(dailyLogs, 7);
  const trend30d = buildTrend(dailyLogs, 30);
  const energyValues = dailyLogs.map((log) => log.battery_level);
  const moodValues = dailyLogs.map((log) => log.mood_score);
  const relationshipRows = buildRelationships(interactions);
  const recovery = buildRecovery(recoveries);
  const highDrainImpact = buildHighDrainImpact(dailyLogs, interactions);
  const averageMood = average(moodValues);
  const averageDrain = average(interactions.map((item) => item.drain_score));
  const highDrainCount = interactions.filter(
    (item) => Number(item.drain_score) <= HIGH_DRAIN_THRESHOLD,
  ).length;

  console.log("Analytics data:", {
    energyValues,
  });
  return {
    energy: { "7d": trend7d, "30d": trend30d, average: average(energyValues) },
    mood: {
      "7d": trend7d.map(({ date, mood }) => ({ date, mood })),
      "30d": trend30d.map(({ date, mood }) => ({ date, mood })),
      average: averageMood,
      averageLabel: moodLabel(averageMood),
    },
    interactions: {
      total: interactions.length,
      averageDrain,
      highDrainCount,
    },
    relationships: {
      lifeGiving: relationshipRows.filter(
        (item) => item.classification === "life-giving",
      ),
      highDrain: relationshipRows.filter(
        (item) => item.classification === "high-drain",
      ),
      other: relationshipRows.filter(
        (item) => !["life-giving", "high-drain"].includes(item.classification),
      ),
    },
    highDrainImpact,
    recovery: { mostEffective: recovery },
    patterns: buildPatterns(highDrainImpact, relationshipRows, recovery),
  };
}

export {
  buildHighDrainImpact,
  buildRelationships,
  buildTrend,
} from "./analytics.builders.js";
export {
  HIGH_DRAIN_THRESHOLD,
  LIFE_GIVING_THRESHOLD,
} from "./analytics.constants.js";
export { average, calendarDays, moodLabel } from "./analytics.helpers.js";
