import db from "../../config/db.js";

export const insertEnergyLog = async (
  userId,
  { log_date, battery_level, mood_score },
) => {
  const insertQuery = `
    INSERT INTO daily_logs (user_id, log_date, battery_level, mood_score)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, log_date) 
    DO UPDATE SET 
      battery_level = EXCLUDED.battery_level,
      mood_score = EXCLUDED.mood_score
    RETURNING id, log_date, battery_level, mood_score
  `;

  const result = await db.query(insertQuery, [
    userId,
    log_date,
    battery_level,
    mood_score,
  ]);

  return result[0] || null;
};
0;

export const insertInteraction = async (
  userId,
  {
    daily_log_id,
    duration_minutes,
    drain_score,
    relationship_type_id,
    custom_name,
  },
) => {
  const insertQuery = `
    INSERT INTO social_interactions (daily_log_id, duration_minutes, drain_score, relationship_type_id, custom_name, interaction_time)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id, daily_log_id, duration_minutes, drain_score, custom_name
  `;

  const result = await db.query(insertQuery, [
    daily_log_id,
    duration_minutes,
    drain_score,
    relationship_type_id,
    custom_name,
  ]);
  return result?.rows?.[0] || null;
};

export const fetchCopingActivities = async (userId) => {
  const q = `
    SELECT id, name, effort_level, success_score, usage_count
    FROM coping_activities
    WHERE user_id = $1
    ORDER BY success_score DESC
    LIMIT 10
  `;

  const result = await db.query(q, [userId]);
  return result?.rows || [];
};

export const insertCopingActivity = async (userId, { name, effort_level }) => {
  const q = `
    INSERT INTO coping_activities (user_id, name, effort_level, success_score, usage_count)
    VALUES ($1, $2, $3, 0, 0)
    RETURNING id, name, effort_level, success_score, usage_count
  `;

  const result = await db.query(q, [userId, name, effort_level]);
  return result?.rows?.[0] || null;
};
