import db from "../../../config/db.js";

export async function upsertDailyLog(
  clerkId,
  logDate,
  batteryLevel,
  moodScore,
) {
  const result = await db.query(
    `INSERT INTO daily_logs (user_id, log_date, battery_level, mood_score)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, log_date) 
     DO UPDATE SET 
       battery_level = EXCLUDED.battery_level,
       mood_score = COALESCE(EXCLUDED.mood_score, daily_logs.mood_score)
     RETURNING id, user_id, log_date, battery_level, mood_score, created_at`,
    [clerkId, logDate, batteryLevel, moodScore],
  );
  return result[0];
}

export async function getEnergyLogByDate(clerkId, logDate) {
  const result = await db.query(
    `SELECT id, user_id, log_date, battery_level, mood_score, created_at
     FROM daily_logs
     WHERE user_id = $1 AND log_date = $2`,
    [clerkId, logDate],
  );
  return result[0] || null;
}
