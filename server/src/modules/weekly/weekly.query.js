import db from "../../config/db.js";

let tableEnsured = false;

const unwrapRows = (result) =>
  Array.isArray(result) ? result : result?.rows || [];

const ensureWeeklyInsightsTable = async () => {
  if (tableEnsured) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS weekly_insights (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      week_start DATE NOT NULL,
      metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
      observations JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, week_start)
    )
  `);

  tableEnsured = true;
};

export async function fetchWeeklyRows(userId, weekStart) {
  const [dailyResult, interactionResult, recoveryResult, baselineResult] =
    await Promise.all([
      db.query(
        `SELECT log_date, battery_level, mood_score, created_at
         FROM daily_logs
         WHERE user_id = $1
           AND log_date >= $2::date
           AND log_date < $2::date + INTERVAL '7 days'
         ORDER BY log_date DESC`,
        [userId, weekStart],
      ),
      db.query(
        `SELECT si.id, si.duration_minutes, si.drain_score, si.interaction_time,
                si.custom_name, rt.name AS relationship_type
         FROM social_interactions si
         JOIN daily_logs dl ON si.daily_log_id = dl.id
         LEFT JOIN relationship_types rt ON si.relationship_type_id = rt.id
         WHERE dl.user_id = $1
           AND si.interaction_time >= $2::date
           AND si.interaction_time < $2::date + INTERVAL '7 days'
         ORDER BY si.interaction_time DESC`,
        [userId, weekStart],
      ),
      db.query(
        `SELECT ca.name AS activity_name, rs.rating, rs.completed_at
         FROM recovery_sessions rs
         JOIN coping_activities ca ON ca.id = rs.activity_id
         JOIN social_interactions si ON si.id = rs.interaction_id
         JOIN daily_logs dl ON dl.id = si.daily_log_id
         WHERE dl.user_id = $1
           AND rs.is_complete = TRUE
           AND rs.completed_at >= $2::date
           AND rs.completed_at < $2::date + INTERVAL '7 days'
         ORDER BY rs.completed_at DESC`,
        [userId, weekStart],
      ),
      db.query(
        `SELECT AVG(battery_level)::float AS average
         FROM daily_logs
         WHERE user_id = $1 AND battery_level IS NOT NULL`,
        [userId],
      ),
    ]);

  return {
    dailyLogs: unwrapRows(dailyResult),
    interactions: unwrapRows(interactionResult),
    recoveries: unwrapRows(recoveryResult),
    energyBaseline: unwrapRows(baselineResult)[0]?.average ?? null,
  };
}

export async function upsertWeeklyInsight({
  userId,
  weekStart,
  metrics,
  observations,
}) {
  await ensureWeeklyInsightsTable();

  const result = await db.query(
    `INSERT INTO weekly_insights (user_id, week_start, metrics, observations)
     VALUES ($1, $2, $3::jsonb, $4::jsonb)
     ON CONFLICT (user_id, week_start)
     DO UPDATE SET
       metrics = EXCLUDED.metrics,
       observations = EXCLUDED.observations,
       updated_at = NOW()
     RETURNING id, week_start, metrics, observations, created_at, updated_at`,
    [userId, weekStart, JSON.stringify(metrics), JSON.stringify(observations)],
  );

  return result[0];
}

export async function fetchLatestInsight(userId) {
  await ensureWeeklyInsightsTable();

  const result = await db.query(
    `SELECT id, week_start, metrics, observations, created_at, updated_at
     FROM weekly_insights
     WHERE user_id = $1
     ORDER BY week_start DESC, id DESC
     LIMIT 1`,
    [userId],
  );

  return result[0] || null;
}