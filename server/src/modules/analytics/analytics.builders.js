import {
  HIGH_DRAIN_THRESHOLD,
  LIFE_GIVING_THRESHOLD,
} from "./analytics.constants.js";
import {
  average,
  calendarDays,
  dateKey,
  numberOrNull,
} from "./analytics.helpers.js";

export const buildTrend = (dailyLogs, days) => {
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

export const buildRelationships = (interactions) => {
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

export const buildHighDrainImpact = (dailyLogs, interactions) => {
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

export const buildRecovery = (recoveries) => {
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

export const buildPatterns = (impact, relationships, recovery) => {
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
