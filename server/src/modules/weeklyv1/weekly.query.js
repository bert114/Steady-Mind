import db from "../../config/db.js";

const unwrapRows = (result) =>
  Array.isArray(result) ? result : result?.rows || [];

export async function fetchDailyLogs(userId, weekStart) {
  const result = await db.query(
    `SELECT log_date, battery_level, mood_score
     FROM daily_logs
     WHERE user_id = $1
       AND log_date >= $2::date
       AND log_date < $2::date + INTERVAL '7 days'
       AND (battery_level IS NOT NULL OR mood_score IS NOT NULL)
     ORDER BY log_date ASC`,
    [userId, weekStart],
  );

  return unwrapRows(result);
}

export async function fetchWeekInteractions(userId, weekStart) {
  const result = await db.query(
    `SELECT si.id, si.drain_score, si.interaction_time,
            si.custom_name, rt.name AS relationship_type
     FROM social_interactions si
     JOIN daily_logs dl ON si.daily_log_id = dl.id
     LEFT JOIN relationship_types rt ON si.relationship_type_id = rt.id
     WHERE dl.user_id = $1
       AND si.drain_score IS NOT NULL
       AND si.interaction_time >= $2::date
       AND si.interaction_time < $2::date + INTERVAL '7 days'
     ORDER BY si.interaction_time ASC`,
    [userId, weekStart],
  );

  return unwrapRows(result);
}
