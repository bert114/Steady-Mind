import db from "../../config/db.js";

export async function createRecoverySession(
  clerkId,
  interactionId,
  activityId,
  rating,
) {
  const result = await db.query(
    `INSERT INTO recovery_sessions (interaction_id, activity_id, rating, is_complete, completed_at)
     VALUES ($1, $2, $3, TRUE, NOW())
     RETURNING id, interaction_id, activity_id, rating, is_complete, completed_at`,
    [interactionId, activityId, rating],
  );

  await db.query(
    `UPDATE coping_activities 
     SET usage_count = usage_count + 1 
     WHERE id = $1`,
    [activityId],
  );

  return result;
}

export async function fetchDashboardState(clerkId) {
  const result = await db.query(
    `SELECT 
        rs.id AS session_id,
        rs.rating,
        rs.completed_at,
        ca.name AS activity_name,
        si.id AS interaction_id,
        si.drain_score
     FROM recovery_sessions rs
     JOIN coping_activities ca ON rs.activity_id = ca.id
     JOIN social_interactions si ON rs.interaction_id = si.id
     JOIN daily_logs dl ON si.daily_log_id = dl.id
     WHERE dl.user_id = $1
     ORDER BY rs.completed_at DESC
     LIMIT 5`,
    [clerkId],
  );
  return result;
}

export async function fetchCopingActivities(clerkId) {
  const result = await db.query(
    `SELECT 
        ca.id, 
        ca.name, 
        ca.effort_level, 
        ca.success_score, 
        ca.usage_count,
        CASE 
          WHEN completed_today.id IS NOT NULL THEN TRUE 
          ELSE FALSE 
        END AS is_completed,
        completed_today.rating AS last_rating
     FROM coping_activities ca
     LEFT JOIN (
       SELECT rs.id, rs.activity_id, rs.rating
       FROM recovery_sessions rs
       JOIN social_interactions si ON rs.interaction_id = si.id
       JOIN daily_logs dl ON si.daily_log_id = dl.id
       WHERE dl.user_id = $1 
         AND rs.completed_at::date = CURRENT_DATE
         AND rs.is_complete = TRUE
     ) completed_today ON ca.id = completed_today.activity_id
     WHERE ca.user_id = $1 OR ca.user_id IS NULL 
     ORDER BY ca.success_score DESC, ca.usage_count DESC`,
    [clerkId],
  );

  return result;
}
