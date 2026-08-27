import db from "../../config/db.js";

export async function fetchRecentDailyLogs(clerkId, limit = 30) {
  return await db.query(
    `SELECT battery_level, mood_score, log_date 
     FROM daily_logs 
     WHERE user_id = $1 
     ORDER BY log_date DESC 
     LIMIT $2`,
    [clerkId, limit],
  );
}

export async function fetchRecentInteractions(clerkId, limit = 5) {
  return await db.query(
    `SELECT si.id, si.drain_score, si.duration_minutes, si.interaction_time 
     FROM social_interactions si
     JOIN daily_logs dl ON si.daily_log_id = dl.id
     WHERE dl.user_id = $1 
     ORDER BY si.interaction_time DESC 
     LIMIT $2`,
    [clerkId, limit],
  );
}

export async function checkUserExists(clerkId) {
  const result = await db.query(
    `SELECT clerk_id FROM users WHERE clerk_id = $1`,
    [clerkId],
  );
  return result.length > 0;
}
