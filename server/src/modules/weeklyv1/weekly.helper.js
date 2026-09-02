function calculateAverage(totalValue, numberOfValues) {
  if (numberOfValues === 0) {
    return 0;
  }

  return totalValue / numberOfValues;
}

function formatLogDates(data) {
  return data.map((item) => ({
    ...item,
    log_date: new Date(item.log_date).toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    }),
  }));
}
export function identifyBurnoutDays(data) {
  const burnoutDays = data
    .filter((item) => item.drain_score <= -1 && item.drain_score >= -5)
    .map((item) => `${item.log_date}: Drain score of ${item.drain_score}`);

  if (burnoutDays.length === 0) {
    return "No burnout days identified.";
  }

  return `Burnout Days Detected:\n${burnoutDays.join("\n")}`;
}

export { calculateAverage, formatLogDates };
