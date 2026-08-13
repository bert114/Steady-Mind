import { formatLogDate } from "./interaction.helper.js";
import {
  FETCH_ALL_USER_INTERACTIONS_QUERY,
  INSERT_INTERACTION_QUERY,
  UPSERT_DAILY_LOG_QUERY,
} from "./interaction.query.js";
import { calculateUserBurnoutRisk } from "../../burnout/burnout.service.js";
import db from "../../../config/db.js";
export const saveInteractionRecord = async ({
  user_id,
  custom_name,
  duration_minutes,
  drain_score,
  timestamp,
  relationship_type_id,
}) => {
  const interactionTime = timestamp ? new Date(timestamp) : new Date();
  const logDate = formatLogDate(interactionTime);

  const logResult = await db.query(UPSERT_DAILY_LOG_QUERY, [user_id, logDate]);
  const dailyLogId = logResult[0].id;

  const interactionResult = await db.query(INSERT_INTERACTION_QUERY, [
    dailyLogId,
    relationship_type_id ?? null,
    custom_name ?? null,
    duration_minutes,
    drain_score,
    interactionTime,
  ]);

  const savedInteraction = interactionResult[0];

  const burnoutRisk = await calculateUserBurnoutRisk(user_id);

  return {
    savedInteraction,
    burnoutRisk,
  };
};

export const getAllUserSocialInteractions = async (clerkUserId) => {
  return await db.query(FETCH_ALL_USER_INTERACTIONS_QUERY, [clerkUserId]);
};
