export function calculateAverages(logs) {
  if (!logs || logs.length === 0) {
    return { averageBattery: 0, averageMood: 0 };
  }

  const totals = logs.reduce(
    (accumulator, currentLog) => {
      accumulator.battery += currentLog.battery_level;
      accumulator.mood += currentLog.mood_score;
      return accumulator;
    },
    { battery: 0, mood: 0 },
  );

  return {
    averageBattery: totals.battery / logs.length,
    averageMood: totals.mood / logs.length,
  };
}

export function getAverageDrainScore(logs) {
  if (!logs || logs.length === 0) {
    return 0;
  }

  const totalDrain = logs.reduce((sum, currentLog) => {
    return sum + (currentLog.drain_score || 0);
  }, 0);

  return totalDrain / logs.length;
}

export function formatLogDates(logs) {
  return logs.map((item) => ({
    ...item,
    log_date: new Date(item.log_date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  }));
}

export function getDetailedDrainingMessages(logs) {
  return logs
    .filter((item) => item.drain_score < 0)
    .map(
      (item) =>
        `${item.log_date} is draining with a score of ${item.drain_score}`,
    );
}

export function detectDrainInteraction(logs) {}

const separateType = (arr, type) => {
  return arr.filter((log) => log.relationship === type);
};

export function getHighestDrain(logs) {
  const test = {};

  const friends = separateType(logs, "Friend");
  const coWorker = separateType(logs, "Coworker");
  const stranger = separateType(logs, "Stranger");
  const partner = separateType(logs, "Partner");

  const drainScore = friends.map((friend) => friend.drain_score);

  console.log({ friends, coWorker, stranger, partner });

  // console.log("test", {
  //   friends: drainScore,
  // });

  // console.log("test", friends);
}
