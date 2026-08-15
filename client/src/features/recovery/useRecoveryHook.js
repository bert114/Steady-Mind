import { useEffect } from "react";
import { buildRecoverySessionPayload, isElevatedRisk } from "./recovery.util";
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
      fetchRecommendations(id);
    }
  }, [elevated, clerkId, fetchRecommendations]);

  useEffect(() => {});

  const handleComplete = async (
    activityId,
    rating = 5,
    interactionId = 1,
    isComplete = true,
  ) => {
    if (!clerkId) return;

    const payload = buildRecoverySessionPayload(
      activityId,
      rating,
      interactionId,
      isComplete,
    );

    return await completeActivity(clerkId, payload);
  };

  return {
    isElevated: elevated,
    recommendations,
    loading,
    error,
    completeActivity: handleComplete,
  };
}
