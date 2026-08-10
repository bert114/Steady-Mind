import db from "../../../config/db.js";

export const insertLog = async (userId, logDate, energyLevel, moodScore) => {
  const sqlQuery = `
    INSERT INTO daily_logs (user_id, log_date, battery_level, mood_score)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, log_date) 
    DO UPDATE SET 
      battery_level = EXCLUDED.battery_level,
      mood_score = EXCLUDED.mood_score
    RETURNING id, user_id, log_date, battery_level, mood_score, created_at;
  `;
  const row = await db.query(sqlQuery, [
    userId,
    logDate,
    energyLevel,
    moodScore,
  ]);

  console.log("Inserted/Updated log:", row);
  return row;
};

export const fetchLogsByUserId = async (userId) => {
  const sqlQuery = `
    SELECT id, user_id, log_date, battery_level, mood_score, created_at
    FROM daily_logs
    WHERE user_id = $1
    ORDER BY log_date DESC;
  `;
  const rows = await db.query(sqlQuery, [userId]);
  return rows;
};

export const modifyLog = async (id, energyLevel, moodScore) => {
  const sqlQuery = `
    UPDATE daily_logs
    SET 
      battery_level = COALESCE($1, battery_level),
      mood_score = COALESCE($2, mood_score)
    WHERE id = $3
    RETURNING id, user_id, log_date, battery_level, mood_score, created_at;
  `;
  const row = await db.query(sqlQuery, [energyLevel, moodScore, id]);
  return row;
};

export const removeLog = async (id) => {
  const sqlQuery = `DELETE FROM daily_logs WHERE id = $1 RETURNING id;`;
  const row = await db.query(sqlQuery, [id]);
  return row;
};
