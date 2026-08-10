export function normalizeBatteryValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  if (parsed > 100) {
    return 100;
  }

  if (parsed <= 10 && parsed >= 0) {
    return parsed * 10;
  }

  return Math.max(0, Math.min(100, parsed));
}

export function normalizeMoodValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.max(1, Math.min(10, parsed));
}

export function calculateBurnoutRisk({
  latestBattery,
  latestMood,
  recentInteractions,
  recentEntries,
}) {
  const normalizedBattery = normalizeBatteryValue(latestBattery);
  const normalizedMood = normalizeMoodValue(latestMood);
  const lowBatteryStreak = recentEntries.filter((entry) => {
    const battery = normalizeBatteryValue(entry?.battery_level);
    return battery <= 40;
  }).length;
  const highDrainCount = recentInteractions.filter((entry) => {
    const drain = Number(entry?.drain_score);
    return Number.isFinite(drain) && drain <= -3;
  }).length;

  const score =
    (100 - normalizedBattery) * 0.5 +
    (11 - normalizedMood) * 4 +
    highDrainCount * 12 +
    Math.max(0, lowBatteryStreak - 2) * 10;

  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: clamped,
    label: clamped > 70 ? "High" : clamped > 40 ? "Moderate" : "Low",
  };
}

export function getRecoveryPrompt({
  latestBattery,
  latestMood,
  recentInteractions,
  recentEntries,
  copingActivities,
}) {
  const normalizedBattery = normalizeBatteryValue(latestBattery);
  const latestInteraction = recentInteractions[recentInteractions.length - 1];
  const severeDrain = Number(latestInteraction?.drain_score) <= -3;
  const lowBattery = normalizedBattery <= 30;
  const lowBatteryStreak = recentEntries.filter((entry) => {
    const battery = normalizeBatteryValue(entry?.battery_level);
    return battery <= 40;
  }).length;

  const shouldPrompt = severeDrain || lowBattery || lowBatteryStreak >= 3;

  if (!shouldPrompt) {
    return null;
  }

  const fallbackActivities = [
    {
      id: "rest",
      name: "Sit in stillness for 5 minutes",
      effort_level: "low",
      tags: ["solo", "quiet"],
    },
    {
      id: "tea",
      name: "Make tea and breathe slowly",
      effort_level: "low",
      tags: ["quick", "solo"],
    },
    {
      id: "walk",
      name: "Take a gentle walk outside",
      effort_level: "medium",
      tags: ["solo", "sensory"],
    },
  ];

  const activities = (
    copingActivities?.length ? copingActivities : fallbackActivities
  )
    .filter((activity) => activity.effort_level !== "high")
    .slice(0, 3);

  return {
    title: lowBattery
      ? "You need a softer landing"
      : "A recovery pause would help",
    description: lowBattery
      ? "Your energy is running low. Pick one small reset that can lower the load right now."
      : "A brief reset will help your nervous system catch up before the next demand.",
    activities,
  };
}
