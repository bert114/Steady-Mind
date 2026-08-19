import {
  fetchCopingActivities,
  createRecoverySession,
  fetchDashboardState,
  fetchCopingActivitiesNew,
  CALCULATE_AVG_RATING,
} from "./recovery.query.js";
import { getUserBurnoutStatus } from "../burnout/burnout.service.js";
import { recommendRecoveryAction } from "./recovery.helper.js";
import { formatRecoveryResponse } from "./recovery.utils.js";
import { checkUserExists } from "../burnout/burnout.query.js";
import throwError from "../../utils/throwError.js";
import db from "../../config/db.js";

export async function getRecoveryRecommendations(clerkId) {
  const exists = await checkUserExists(clerkId);
  if (!exists) {
    throwError(`User with ID '${clerkId}' not found.`, 404);
  }

  const burnoutStatus = await getUserBurnoutStatus(clerkId);
  const activities = await fetchCopingActivities(clerkId);

  const test = await fetchCopingActivitiesNew(clerkId);
  const bestPerformance = await calculateAvgRating(clerkId);

  const rawRecommendation = recommendRecoveryAction(
    bestPerformance,
    burnoutStatus.riskLevel,
    activities,
    test,
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

//newwwwwwwwww

export const logSession = async ({
  interact_id,
  id,
  rating,
  is_complete,
  completedAt,
}) => {
  const result = await db.query(
    `INSERT INTO recovery_sessions
    
        (interaction_id, activity_id, completed_at, rating, is_complete)
         VALUES ($1, $2, $3, $4, true)
     RETURNING *`,
    [interact_id, id, completedAt, rating],
  );

  return result;
};

export const calculateAvgRating = async (user_id) => {
  return await db.query(CALCULATE_AVG_RATING, [user_id]);
};
