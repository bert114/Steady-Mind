export function formatActivityList(activities = []) {
  return activities.map((activity) => ({
    id: activity.id,
    name: activity.name,
    effort: activity.effort_level || "Standard",
    usageCount: activity.usage_count || 0,
    rating: activity.success_score || 0,
    isCompleted: activity.is_completed || false,
    lastRating: activity.last_rating || null,
  }));
}

export function isElevatedRisk(riskLevel) {
  const targetRisks = ["RED", "YELLOW"];
  return targetRisks.includes(riskLevel);
}

export const buildRecoverySessionPayload = (
  activityId,
  rating = 5,
  interactionId = 1,
  isComplete = true,
) => {
  return {
    activityId: Number(activityId),
    interactionId: Number(interactionId),
    rating,
    is_complete: Boolean(isComplete),
  };
};
