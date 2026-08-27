import { fetchAnalyticsRows } from "./analytics.query.js";

export const HIGH_DRAIN_THRESHOLD = -3;
export const LIFE_GIVING_THRESHOLD = 3;
const MOOD_LABELS = ["Very Low", "Low", "Okay", "Good", "Great"];

const numberOrNull = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const dateKey = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

const calendarDays = (days, now = new Date()) => {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (days - index - 1));
    return date.toISOString().slice(0, 10);
  });
};

const average = (values) => {
  const numbers = values.map(Number).filter(Number.isFinite);
  if (!numbers.length) return null;
  return Number(
    (numbers.reduce((sum, value) => sum + value, 0) / numbers.length).toFixed(
      1,
    ),
  );
};

const moodLabel = (score) => {
  if (score === null) return null;
  return MOOD_LABELS[Math.max(1, Math.min(5, Math.round(score))) - 1];
};

const buildTrend = (dailyLogs, days) => {
  const byDate = new Map(dailyLogs.map((log) => [dateKey(log.log_date), log]));
  return calendarDays(days).map((date) => {
    const log = byDate.get(date);
    return {
      date,
      energy: numberOrNull(log?.battery_level),
      mood: numberOrNull(log?.mood_score),
    };
  });
};

const buildRelationships = (interactions) => {
  const groups = new Map();
  interactions.forEach((interaction) => {
    const name =
      interaction.custom_name?.trim() ||
      interaction.relationship_type ||
      "Other";
    const group = groups.get(name) || { name, scores: [] };
    group.scores.push(Number(interaction.drain_score));
    groups.set(name, group);
  });

  return [...groups.values()]
    .map(({ name, scores }) => {
      const averageDrain = average(scores);
      return {
        name,
        interactionCount: scores.length,
        averageDrain,
        classification:
          scores.length < 2
            ? "insufficient-data"
            : averageDrain >= LIFE_GIVING_THRESHOLD
              ? "life-giving"
              : averageDrain <= HIGH_DRAIN_THRESHOLD
                ? "high-drain"
                : "neutral",
      };
    })
    .sort((a, b) => (a.averageDrain ?? 0) - (b.averageDrain ?? 0));
};

const buildHighDrainImpact = (dailyLogs, interactions) => {
  const energyLogs = dailyLogs
    .map((log) => ({ ...log, at: new Date(log.created_at || log.log_date) }))
    .filter((log) => !Number.isNaN(log.at.getTime()))
    .sort((a, b) => a.at - b.at);

  const changes = interactions
    .filter(
      (interaction) => Number(interaction.drain_score) <= HIGH_DRAIN_THRESHOLD,
    )
    .map((interaction) => {
      const at = new Date(interaction.interaction_time);
      const before = [...energyLogs].reverse().find((log) => log.at < at);
      const after = energyLogs.find((log) => log.at > at);
      if (!before || !after) return null;
      return {
        interactionId: interaction.id,
        change: Number(after.battery_level) - Number(before.battery_level),
      };
    })
    .filter(Boolean);

  return {
    averageChange: average(changes.map((item) => item.change)),
    sampleCount: changes.length,
    changes,
  };
};

const buildRecovery = (recoveries) => {
  const groups = new Map();
  recoveries.forEach((recovery) => {
    const group = groups.get(recovery.activity_name) || [];
    group.push(Number(recovery.rating));
    groups.set(recovery.activity_name, group);
  });

  return [...groups.entries()]
    .filter(([, ratings]) => ratings.length >= 2)
    .map(([name, ratings]) => ({
      name,
      averageRating: average(ratings),
      attemptCount: ratings.length,
    }))
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);
};

const buildPatterns = (impact, relationships, recovery) => {
  const patterns = [];
  if (impact.averageChange !== null) {
    patterns.push({
      key: "high-drain-impact",
      text:
        impact.averageChange < 0
          ? `Your energy drops by about ${Math.abs(impact.averageChange)} points after high-drain interactions.`
          : `Your energy rises by about ${impact.averageChange} points after high-drain interactions.`,
    });
  } else {
    patterns.push({
      key: "high-drain-impact",
      text: "Log energy before and after a high-drain interaction to see its effect.",
    });
  }

  const highDrainRelationship = relationships.find(
    (item) => item.classification === "high-drain",
  );
  patterns.push({
    key: "draining-relationship",
    text: highDrainRelationship
      ? `${highDrainRelationship.name} is your highest-drain connection in the last 30 days.`
      : "Log two interactions with the same person or category to compare relationships.",
  });

  patterns.push({
    key: "effective-recovery",
    text: recovery[0]
      ? `${recovery[0].name} has helped you the most so far.`
      : "Rate a recovery activity twice to find what helps you most.",
  });
  return patterns;
};

export async function getAnalytics(userId) {
  const { dailyLogs, interactions, recoveries } =
    await fetchAnalyticsRows(userId);
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
  average,
  buildHighDrainImpact,
  buildRelationships,
  buildTrend,
  calendarDays,
  moodLabel,
};
