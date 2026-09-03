import db from "../../config/db.js";

const unwrapRows = (result) =>
  Array.isArray(result) ? result : result?.rows || [];

export async function fetchDailyEnergy(userId, weekStart) {
  const result = await db.query(
    `SELECT log_date, battery_level
     FROM daily_logs
     WHERE user_id = $1
       AND battery_level IS NOT NULL
       AND log_date >= $2::date
       AND log_date < $2::date + INTERVAL '7 days'
     ORDER BY log_date ASC`,
    [userId, weekStart],
  );

  return unwrapRows(result);
}
