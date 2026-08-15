import {
  fetchCopingActivities,
  createRecoverySession,
  fetchDashboardState,
} from "./recovery.query.js";
import { getUserBurnoutStatus } from "../burnout/burnout.service.js";
import { recommendRecoveryAction } from "./recovery.helper.js";
import { formatRecoveryResponse } from "./recovery.utils.js";
import { checkUserExists } from "../burnout/burnout.query.js";
import throwError from "../../utils/throwError.js";

export async function getRecoveryRecommendations(clerkId) {
  const exists = await checkUserExists(clerkId);
  if (!exists) {
    throwError(`User with ID '${clerkId}' not found.`, 404);
  }

  const burnoutStatus = await getUserBurnoutStatus(clerkId);
  const activities = await fetchCopingActivities(clerkId);

  const rawRecommendation = recommendRecoveryAction(
    burnoutStatus.riskLevel,
    activities,
  );

  return formatRecoveryResponse(rawRecommendation);
}

export async function logRecoveryAction(
  clerkId,
  interactionId,
  activityId,
  rating,
) {
  return await createRecoverySession(
    clerkId,
    interactionId,
    activityId,
    rating,
  );
}

export async function getUserDashboardState(clerkId) {
  const exists = await checkUserExists(clerkId);
  if (!exists) {
    throwError(`User with ID '${clerkId}' not found.`, 404);
  }

  const burnoutStatus = await getUserBurnoutStatus(clerkId);
  const recentRecoveries = await fetchDashboardState(clerkId);

  return {
    burnoutStatus,
    recentRecoveries,
    lastRefreshedAt: new Date().toISOString(),
  };
}
