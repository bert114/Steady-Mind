function computeMetrics(values) {
  if (values.length === 0) {
    return {
      average: null,
      min: null,
      max: null,
      loggedDays: 0,
    };
  }

  const sum = values.reduce((total, value) => total + value, 0);

  return {
    average: sum / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    loggedDays: values.length,
  };
}

export function computeEnergyMetrics(rows) {
  return computeMetrics(
    rows.map((row) => row.battery_level).filter((value) => value != null),
  );
}

export function computeMoodMetrics(rows) {
  return computeMetrics(
    rows.map((row) => row.mood_score).filter((value) => value != null),
  );
}

export function computeDrainMetrics(interactions) {
  return computeMetrics(
    interactions
      .map((row) => row.drain_score)
      .filter((value) => value != null),
  );
}

export function findHighestDrainingRelationship(interactions) {
  const byRelationship = {};

  for (const row of interactions) {
    if (row.drain_score == null) continue;

    const type = row.relationship_type || "Unknown";
    const name = row.custom_name || type;

    if (!byRelationship[type]) {
      byRelationship[type] = { scores: [], name };
    }
    byRelationship[type].scores.push(row.drain_score);
  }

  const entries = Object.entries(byRelationship).map(([type, entry]) => {
    const sum = entry.scores.reduce((total, value) => total + value, 0);
    return {
      relationshipType: type,
      relationship: entry.name,
      average: sum / entry.scores.length,
      count: entry.scores.length,
    };
  });

  if (entries.length === 0) return null;

  entries.sort((a, b) => a.average - b.average);

  return entries[0];
}
