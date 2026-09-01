export function recommendRecoveryAction(
  performance,
  riskLevel,
  availableActivities = [],
  test,
) {
  const normalizedRisk = String(riskLevel).toUpperCase();

  if (normalizedRisk.includes("GREEN") || normalizedRisk.includes("STABLE")) {
    return {
      recommended: false,
      message: "Your energy is stable. Maintain standard routines.",
      suggestedActivities: [],
    };
  }

  const isHighRisk =
    normalizedRisk.includes("RED") || normalizedRisk.includes("HIGH");
  const targetEffort = isHighRisk ? "LOW" : "MEDIUM";

  const filtered = availableActivities.filter((act) => {
    if (!act.effort_level) return true;
    return String(act.effort_level).toUpperCase() === targetEffort;
  });

  const selectedActivities =
    filtered.length > 0 ? filtered : availableActivities.slice(0, 3);

  const hasPersonalHistory = selectedActivities.some(
    (activity) => Number(activity.completed_count) > 0,
  );

  const rankedActivities = [...selectedActivities].sort((left, right) => {
    const leftRating = Number(left.average_rating);
    const rightRating = Number(right.average_rating);
    const leftHasRating = hasStoredRating(left.average_rating);
    const rightHasRating = hasStoredRating(right.average_rating);

    if (leftHasRating !== rightHasRating) return rightHasRating - leftHasRating;
    if (leftHasRating && leftRating !== rightRating) {
      return rightRating - leftRating;
    }

    const completedDifference =
      Number(right.completed_count || 0) - Number(left.completed_count || 0);
    if (completedDifference !== 0) return completedDifference;

    return Number(right.success_score || 0) - Number(left.success_score || 0);
  });

  const sanitizedActivities = rankedActivities.map((act, index) => ({
    ...act,
    is_completed: act.is_completed === true,
    recommendation_reason: hasStoredRating(act.average_rating)
      ? `You rated this ${act.average_rating}/5 across ${act.completed_count} completed ${Number(act.completed_count) === 1 ? "try" : "tries"}.`
      : hasPersonalHistory
        ? "A new option while Steady Mind learns what helps you most."
        : "A starting option while Steady Mind learns what helps you most.",
    is_personalized: hasStoredRating(act.average_rating),
    recommendation_rank: index + 1,
  }));

  const bestPersonalActivity = sanitizedActivities.find(
    (activity) => activity.is_personalized,
  );

  return {
    performance,
    test,
    recommended: true,
    riskLevel,
    message: bestPersonalActivity
      ? `You usually feel better after ${bestPersonalActivity.name}. It is first because your past ratings are strongest for it.`
      : isHighRisk
        ? "High burnout risk detected. Start with a low-effort recovery activity while Steady Mind learns what helps you."
        : "Warning level detected. Choose a manageable recovery activity while Steady Mind learns what helps you.",
    suggestedActivities: sanitizedActivities,
  };
}

function hasStoredRating(value) {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    Number.isFinite(Number(value))
  );
}
