export function recommendRecoveryAction(riskLevel, availableActivities) {
  if (riskLevel === "GREEN") {
    return {
      recommended: false,
      message: "Your energy is stable. Maintain standard routines.",
      suggestedActivities: [],
    };
  }

  // Simple, deterministic heuristic mapping (No AI)
  const targetEffort = riskLevel === "RED" ? "LOW" : "MEDIUM";
  const filtered = availableActivities.filter(
    (act) => act.effort_level === targetEffort || !act.effort_level,
  );

  return {
    recommended: true,
    riskLevel,
    message:
      riskLevel === "RED"
        ? "High burnout risk detected! We strongly recommend immediate low-effort recovery."
        : "Warning level detected. Consider selecting a light recovery activity.",
    suggestedActivities:
      filtered.length > 0 ? filtered : availableActivities.slice(0, 3),
  };
}
