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

export async function fetchCopingActivities(clerkId) {
  const result = await db.query(
    `SELECT 
        ca.id, 
        ca.name, 
        ca.effort_level, 
        ca.success_score, 
        ca.usage_count,
        COALESCE(user_history.completed_count, 0)::int AS completed_count,
        user_history.average_rating,
        CASE 
          WHEN completed_today.id IS NOT NULL THEN TRUE 
          ELSE FALSE 
        END AS is_completed,
        completed_today.rating AS last_rating
     FROM coping_activities ca
     LEFT JOIN LATERAL (
       SELECT COUNT(rs.id)::int AS completed_count,
              ROUND(AVG(rs.rating), 1) AS average_rating
       FROM recovery_sessions rs
       JOIN social_interactions si ON rs.interaction_id = si.id
       JOIN daily_logs dl ON si.daily_log_id = dl.id
       WHERE rs.activity_id = ca.id
         AND dl.user_id = $1
         AND rs.is_complete = TRUE
     ) user_history ON TRUE
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
     ORDER BY COALESCE(user_history.average_rating, 0) DESC,
              COALESCE(user_history.completed_count, 0) DESC,
              ca.success_score DESC,
              ca.usage_count DESC`,
    [clerkId],
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

export async function fetchCopingActivitiesNew(clerkId) {
  const result = await db.query(
    `SELECT *
     FROM coping_activities 
     WHERE user_id = $1`,
    [clerkId],
  );

  return result;
}

export const TRACK_ACTIVITIES = `SELECT 
    ca.id AS activity_id,
    ca.name AS activity_name,
    rs.id AS session_id,
    rs.completed_at,
    rs.rating
FROM coping_activities ca
JOIN recovery_sessions rs ON ca.id = rs.activity_id
WHERE ca.user_id = $1
  AND rs.completed_at IS NOT NULL;`;

export const CHECK_COMPLETED_ACTIVITIES = `
SELECT EXISTS (
    SELECT 1 
    FROM coping_activities ca
    JOIN recovery_sessions rs ON ca.id = rs.activity_id
    WHERE ca.user_id = $1
      AND ca.id = $2
      AND rs.completed_at IS NOT NULL
) AS is_completed;
`;

export const COMPLETE_SESSION_SATUS = `

  SELECT 
    ca.id AS activity_id,
    ca.name AS activity_name,
    ca.usage_count,
    COUNT(rs.id) AS total_completed_sessions,
    MAX(rs.completed_at) AS last_completed_at
FROM coping_activities ca
LEFT JOIN recovery_sessions rs 
       ON ca.id = rs.activity_id 
      AND rs.completed_at IS NOT NULL
WHERE ca.user_id = $1
GROUP BY ca.id, ca.name, ca.usage_count;

`;

export const CALCULATE_AVG_RATING = `
  SELECT
    ca.name AS activity_name,
    rs.activity_id,
    ROUND(AVG(rs.rating), 1) AS average_rating,
    COUNT(rs.rating) AS total_completed_attempts
  FROM recovery_sessions rs
  JOIN coping_activities ca 
    ON rs.activity_id = ca.id
  WHERE ca.user_id = $1
    AND rs.is_complete = true 
  GROUP BY rs.activity_id, ca.name
  ORDER BY average_rating DESC;
`;
