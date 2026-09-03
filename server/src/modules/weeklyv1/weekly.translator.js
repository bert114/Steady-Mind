export function computeEnergyMetrics(rows) {
  const levels = rows
    .map((row) => row.battery_level)
    .filter((value) => value != null);

  if (levels.length === 0) {
    return {
      average: null,
      min: null,
      max: null,
      loggedDays: 0,
    };
  }

  const sum = levels.reduce((total, value) => total + value, 0);

  return {
    average: sum / levels.length,
    min: Math.min(...levels),
    max: Math.max(...levels),
    loggedDays: levels.length,
  };
}
