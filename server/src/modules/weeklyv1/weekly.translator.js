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

export function computeMoodMetrics(rows) {
  const scores = rows
    .map((row) => row.mood_score)
    .filter((value) => value != null);

  if (scores.length === 0) {
    return {
      average: null,
      min: null,
      max: null,
      loggedDays: 0,
    };
  }

  const sum = scores.reduce((total, value) => total + value, 0);

  return {
    average: sum / scores.length,
    min: Math.min(...scores),
    max: Math.max(...scores),
    loggedDays: scores.length,
  };
}
