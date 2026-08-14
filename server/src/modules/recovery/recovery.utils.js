export function formatRecoveryResponse(recommendationData) {
  return {
    isActionRequired: recommendationData.recommended,
    riskLevel: recommendationData.riskLevel || "GREEN",
    guidance: recommendationData.message,
    activities: recommendationData.suggestedActivities,
    generatedAt: new Date().toISOString(),
  };
}
