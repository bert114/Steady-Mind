import db from "../../config/db.js";

const unwrapRows = (result) =>
  Array.isArray(result) ? result : result?.rows || [];

export async function fetchAnalyticsRows(userId) {
  const [dailyResult, interactionResult, recoveryResult] = await Promise.all([
    db.query(
      `SELECT log_date, battery_level, mood_score, created_at
       FROM daily_logs
       WHERE user_id = $1
         AND log_date >= CURRENT_DATE - INTERVAL '29 days'
         AND log_date <= CURRENT_DATE
       ORDER BY log_date ASC`,
      [userId],
    ),
    db.query(
      `SELECT si.id, si.duration_minutes, si.drain_score, si.interaction_time,
              si.custom_name, rt.name AS relationship_type
       FROM social_interactions si
       JOIN daily_logs dl ON si.daily_log_id = dl.id
       LEFT JOIN relationship_types rt ON si.relationship_type_id = rt.id
       WHERE dl.user_id = $1
         AND si.interaction_time >= CURRENT_DATE - INTERVAL '29 days'
         AND si.interaction_time < CURRENT_DATE + INTERVAL '1 day'
       ORDER BY si.interaction_time ASC`,
      [userId],
    ),
    db.query(
      `SELECT ca.name AS activity_name, rs.rating, rs.completed_at
       FROM recovery_sessions rs
       JOIN coping_activities ca ON ca.id = rs.activity_id
       JOIN social_interactions si ON si.id = rs.interaction_id
       JOIN daily_logs dl ON dl.id = si.daily_log_id
       WHERE dl.user_id = $1
         AND rs.is_complete = TRUE
         AND rs.completed_at >= CURRENT_DATE - INTERVAL '29 days'
         AND rs.completed_at < CURRENT_DATE + INTERVAL '1 day'
       ORDER BY rs.completed_at ASC`,
      [userId],
    ),
  ]);

  return {
    dailyLogs: unwrapRows(dailyResult),
    interactions: unwrapRows(interactionResult),
    recoveries: unwrapRows(recoveryResult),
  };
}
