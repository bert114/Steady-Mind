import { HIGH_DRAIN_THRESHOLD } from "../analytics/analytics.constants.js";
import {
  buildRecovery,
  buildRelationships,
} from "../analytics/analytics.builders.js";
import { average, moodLabel } from "../analytics/analytics.helpers.js";
import { evaluateBurnoutRisk } from "../burnout/burnout.helper.js";
import { formatBurnoutStatus } from "../burnout/burnout.utils.js";

export function buildWeeklyInsight({
  dailyLogs,
  interactions,
  recoveries,
  energyBaseline,
}) {
  const averageEnergy = average(dailyLogs.map((log) => log.battery_level));
  const averageMood = average(dailyLogs.map((log) => log.mood_score));
  const averageDrain = average(interactions.map((item) => item.drain_score));
  const highDrainCount = interactions.filter(
    (item) => Number(item.drain_score) <= HIGH_DRAIN_THRESHOLD,
  ).length;

  const burnout = formatBurnoutStatus(
    evaluateBurnoutRisk(dailyLogs, interactions),
  );

  const relationshipRows = buildRelationships(interactions);
  const highestDrain =
    relationshipRows.find((item) => item.classification === "high-drain") ||
    null;

  const recoveryRows = buildRecovery(recoveries);
  const mostEffectiveRecovery = recoveryRows[0] || null;

  const observations = buildObservations({
    averageEnergy,
    energyBaseline,
    highestDrain,
    mostEffectiveRecovery,
    interactionCount: interactions.length,
  });

  return {
    metrics: {
      averageEnergy,
      averageMood,
      moodLabel: moodLabel(averageMood),
      interactionCount: interactions.length,
      averageDrain,
      highDrainCount,
      burnout,
      highestDrain,
      recovery: mostEffectiveRecovery,
    },
    observations,
  };
}

function buildObservations({
  averageEnergy,
  energyBaseline,
  highestDrain,
  mostEffectiveRecovery,
  interactionCount,
}) {
  const observations = [];

  if (averageEnergy !== null && energyBaseline !== null) {
    const diff = averageEnergy - energyBaseline;
    if (diff < -5) {
      observations.push({
        key: "energy-compared",
        text: "Your energy was lower than usual this week.",
      });
    } else if (diff > 5) {
      observations.push({
        key: "energy-compared",
        text: "Your energy was higher than usual this week.",
      });
    } else {
      observations.push({
        key: "energy-compared",
        text: "Your energy held steady compared with your usual level.",
      });
    }
  } else if (averageEnergy !== null) {
    observations.push({
      key: "energy-compared",
      text: `You averaged ${averageEnergy}% energy this week.`,
    });
  }

  if (highestDrain) {
    observations.push({
      key: "biggest-drain",
      text: `${highestDrain.name} was your biggest source of drain this week.`,
    });
  } else if (interactionCount > 0) {
    observations.push({
      key: "biggest-drain",
      text: "You logged interactions this week, but none showed a strong drain pattern yet.",
    });
  }

  if (mostEffectiveRecovery) {
    observations.push({
      key: "effective-recovery",
      text: `${mostEffectiveRecovery.name} was your most effective recovery activity this week.`,
    });
  } else {
    observations.push({
      key: "effective-recovery",
      text: "Keep rating your recovery activities to find what restores you most.",
    });
  }

  return observations;
}