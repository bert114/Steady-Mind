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
