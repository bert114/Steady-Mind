export function formatActivityList(activities = []) {
  return activities.map((activity) => ({
    id: activity.id,
    name: activity.name,
    effort: activity.effort_level || "Standard",
    usageCount: activity.usage_count || 0,
    rating: activity.success_score || 0,
  }));
}

export function isElevatedRisk(riskLevel) {
  const targetRisks = ["RED", "YELLOW"];
  return targetRisks.includes(riskLevel);
}
