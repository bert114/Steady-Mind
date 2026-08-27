export function formatLogDate(date) {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
}
export function formatBurnoutStatus(riskResult) {
  const statusTitles = {
    RED: "High Burnout Risk",
    YELLOW: "Strained / Warning",
    GREEN: "Stable",
  };

  return {
    riskLevel: riskResult.riskLevel,
    title: statusTitles[riskResult.riskLevel] || "Unknown",
    reasons: riskResult.reasons,
    signals: riskResult.signals,
    latestInteraction: riskResult.latestDrainingInteraction,
    evaluatedAt: new Date().toISOString(),
  };
}
