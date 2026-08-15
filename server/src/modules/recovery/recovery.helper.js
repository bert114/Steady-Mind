export function recommendRecoveryAction(riskLevel, availableActivities = []) {
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

  const sanitizedActivities = selectedActivities.map((act) => ({
    ...act,
    is_completed: act.is_completed === true,
  }));

  return {
    recommended: true,
    riskLevel,
    message: isHighRisk
      ? "High burnout risk detected! We strongly recommend immediate low-effort recovery."
      : "Warning level detected. Consider selecting a light recovery activity.",
    suggestedActivities: sanitizedActivities,
  };
}
