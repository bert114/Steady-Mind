import { useEffect } from "react";
import { isElevatedRisk } from "./recovery.util";
import { id } from "../test/id";
import { useRecoveryStore } from "./useRecoveryStore";

export function useRecovery(riskLevel) {
  const { user } = true;
  const clerkId = id;

  const {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    completeActivity,
  } = useRecoveryStore();

  const elevated = isElevatedRisk(riskLevel);

  useEffect(() => {
    if (elevated && clerkId) {
      fetchRecommendations(clerkId);
    }
  }, [elevated, clerkId, fetchRecommendations]);

  const handleComplete = async (activityId, rating = 5, interactionId = 1) => {
    if (!clerkId) return;
    return await completeActivity(clerkId, {
      interactionId,
      activityId,
      rating,
    });
  };

  return {
    isElevated: elevated,
    recommendations,
    loading,
    error,
    completeActivity: handleComplete,
  };
}
