import db from "../../config/db.js";

export async function fetchCopingActivities(clerkId) {
  const result = await db.query(
    `SELECT id, name, effort_level, success_score, usage_count 
     FROM coping_activities 
     WHERE user_id = $1 OR user_id IS NULL 
     ORDER BY success_score DESC, usage_count DESC`,
    [clerkId],
  );
  return result;
}

export async function createRecoverySession(
  clerkId,
  interactionId,
  activityId,
  rating,
) {
  const result = await db.query(
    `INSERT INTO recovery_sessions (interaction_id, activity_id, rating, completed_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING id, interaction_id, activity_id, rating, completed_at`,
    [interactionId, activityId, rating],
  );

  // Increment usage count on the selected activity
  await db.query(
    `UPDATE coping_activities 
     SET usage_count = usage_count + 1 
     WHERE id = $1`,
    [activityId],
  );

  return result[0];
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
