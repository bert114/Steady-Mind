export function formatRecoveryResponse(recommendationData) {
  return {
    performance: recommendationData.performance,
    test: recommendationData.test,
    isActionRequired: recommendationData.recommended,
    riskLevel: recommendationData.riskLevel || "GREEN",
    guidance: recommendationData.message,
    activities: recommendationData.suggestedActivities,
    generatedAt: new Date().toISOString(),
  };
}
