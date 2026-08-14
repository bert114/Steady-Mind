const LOW_BATTERY_THRESHOLD = 40;
const HIGH_DRAIN_THRESHOLD = -3;

export function evaluateBurnoutRisk(dailyLogs, interactions) {
  const lowBatteryStreak = calculateLowBatteryStreak(dailyLogs);
  const highDrainStreak = calculateHighDrainStreak(interactions);
  const currentBattery =
    dailyLogs.length > 0 ? dailyLogs[0].battery_level : null;

  const redReasons = [];
  const yellowReasons = [];

  if (highDrainStreak >= 3) {
    redReasons.push(
      `${highDrainStreak} consecutive high-drain interactions logged.`,
    );
  }
  if (lowBatteryStreak >= 3) {
    redReasons.push(`${lowBatteryStreak} consecutive low-battery days logged.`);
  }

  if (redReasons.length > 0) {
    return {
      riskLevel: "RED",
      reasons: redReasons,
      signals: { currentBattery, lowBatteryStreak, highDrainStreak },
    };
  }

  if (currentBattery !== null && currentBattery <= LOW_BATTERY_THRESHOLD) {
    yellowReasons.push(
      `Current battery level (${currentBattery}) is at or below ${LOW_BATTERY_THRESHOLD}.`,
    );
  }
  if (highDrainStreak === 2) {
    yellowReasons.push("2 consecutive high-drain interactions logged.");
  }
  if (lowBatteryStreak === 2) {
    yellowReasons.push("2 consecutive low-battery days logged.");
  }

  if (yellowReasons.length > 0) {
    return {
      riskLevel: "YELLOW",
      reasons: yellowReasons,
      signals: { currentBattery, lowBatteryStreak, highDrainStreak },
    };
  }

  return {
    riskLevel: "GREEN",
    reasons: [
      "Your energy and interaction patterns show normal recovery levels.",
    ],
    signals: { currentBattery, lowBatteryStreak, highDrainStreak },
  };
}

function calculateLowBatteryStreak(logs) {
  if (!logs || logs.length === 0) return 0;
  let streak = 0;
  for (const log of logs) {
    if (log.battery_level <= LOW_BATTERY_THRESHOLD) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateHighDrainStreak(interactions) {
  if (!interactions || interactions.length === 0) return 0;
  let streak = 0;
  for (const interaction of interactions) {
    if (interaction.drain_score <= HIGH_DRAIN_THRESHOLD) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
